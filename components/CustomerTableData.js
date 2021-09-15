import React from "react";
import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CustomerModal from "./CustomerModal";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchBar from "material-ui-search-bar";

function createData(
  acno,
  total_Hits,
  // url,
  Last_Hit,
  // db,
  // isAlive,
  // lastUsed,
  // server,
  // version,
  customer
) {
  return {
    acno,
    total_Hits,
    // url,
    Last_Hit,
    // db,
    // isAlive,
    // lastUsed,
    // server,
    // version,
    customer,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "acno",
    numeric: false,
    disablePadding: false,
    label: "CUSTOMER NO",
  },
  { id: "total_Hits", numeric: false, disablePadding: false, label: "TOTAL HITS" },
  // { id: "url", numeric: false, disablePadding: false, label: "API URL" },
  { id: "Last_Hit", numeric: false, disablePadding: false, label: "LAST HITS" },
  ,
  // {
  //   id: "db",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "DB",
  // }
  // {
  //   id: "isAlive",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "ALIVE/DEAD",
  // },
  // {
  //   id: "lastUsed",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "LAST USED",
  // },
  // {
  //   id: "server",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "SERVER",
  // },
  // {
  //   id: "version",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "VERSION",
  // },
  {
    id: "customer",
    numeric: false,
    disablePadding: false,
    label: "CUSTOMERS",
  },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="bg-[#f5f5fd]">
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,

  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

let no = 0;
export default function CustomerTableData({ reload, setReload }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [modalShow, setModalShow] = React.useState(false); //////
  const [modalAcno, setModalAcno] = React.useState();
  const [apis, setApis] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchApiDetails = async () => {
    const response = await fetch(
      `https://bigazure.com/api/json_v4/dashboard/API_PORTAL_API/api_customerDetail.php`
    ).then((res) => res.json());
    setApis(response);
  };

  const [originalRows, setOriginalRows] = React.useState([]);
  const [searched, setSearched] = React.useState("");

  const requestSearch = (searchedVal) => {
    const filteredRowsNo = originalRows.filter((row) => {
      return row.no.toLowerCase().includes(searchedVal.toLowerCase());
    });
    const filteredRowsName = originalRows.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    console.log(filteredRowsNo);
    setRows([...new Set([...filteredRowsNo, ...filteredRowsName])]);
  };
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  React.useEffect(async () => {
    if (reload) {
      setIsLoading(true);
      await fetchApiDetails();
      setIsLoading(false);
      setReload(false);
    }
  }, [reload]);

  React.useEffect(() => {
    if (apis) {
      setOriginalRows([]);
      let newRows = [];
      apis.map((a) => {
        newRows.push(
          createData(
            a["acno"],
            a["total_Hits"],
            // a["api_url"],
            // a["Total Hits"],
            // a["db_name"],
            // a["Alive/Dead"] === "1" ? (
            //   <img src="/alive.gif" />
            // ) : (
            //   <img src="/dead.png" classNaAme="w-[1.5rem]" />
            // ),
            a["Last_Hit"],
            // a["server"],
            // a["version"],
            <AddCircleOutlineIcon
              className="cursor-pointer"
              onClick={() => {
                setModalAcno(a["acno"]);
                setModalShow(true);
              }}
            />
          )
        );
      });
      setRows(newRows);
      setOriginalRows(newRows);
      setIsLoading(false);
    }
  }, [apis]);

  React.useEffect(async () => {
    await fetchApiDetails();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <Paper className={classes.paper}>
          <div className="flex justify-between items-center mb-[1rem]">
            <SearchBar
              value={searched}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
          </div>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={"medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover tabIndex={-1} key={row.no}>
                        <TableCell>{row.acno}</TableCell>
                        <TableCell>{row.total_Hits}</TableCell>
                        {/* <TableCell>{row.url}</TableCell> */}
                        <TableCell>{row.Last_Hit}</TableCell>
                        {/* <TableCell>{row.db}</TableCell> */}
                        {/* <TableCell>{row.isAlive}</TableCell>
                        <TableCell>{row.lastUsed}</TableCell> */}
                        {/* <TableCell>{row.server}</TableCell> */}
                        {/* <TableCell>{row.version}</TableCell> */}
                        <TableCell>{row.customer}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[25, 50, 100,150]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <CustomerModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        acno={modalAcno}
      />
    </div>
  );
}