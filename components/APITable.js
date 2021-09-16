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
import Modals from "./Modals";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchBar from "material-ui-search-bar";

function createData(
  api_no,
  api_name,
  url,
  total_hits,
  category,
  last_updated,
  lastUsed,
  status,
  
) {
  return {
    api_no,
    api_name,
    url,
    total_hits,
    category,
    last_updated,
    lastUsed,
    status,
   
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
  return order === 'desc'
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
  {id: "api_no",numeric: true,disablePadding: false,label: "API NO"},
  {id: "api_name", numeric: false, disablePadding: false, label: "API NAME" },
  {id: "url", numeric: false, disablePadding: false, label: "API URL" },
  {id: "total_hits", numeric: true, disablePadding: false, label: "TOTAL HITS" },
  {id: "category",numeric: false,disablePadding: false,label: "CATEGORY"},
  {id: "last_updated",numeric: false,disablePadding: false,label: "LAST UPDATED"},
  {id: "status",numeric: false,disablePadding: false,label: "STATUS"},
 
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
          align={headCell.numeric ? 'right' : 'left'}
          padding={headCell.disablePadding ? 'none' : 'normal'}
          sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

/*EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
 onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};*/

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
export default function APITable({ reload, setReload }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalAcno, setModalAcno] = React.useState("");
  const [apis, setApis] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

 
  
  const fetchApiDetails = async () => {
    const response = await fetch(
      "http://benefitx.blue-ex.com/api/customerportal/api_details.php"
    ).then((res) => res.json());
    setApis(response.details);
    
      if (location.protocol !== 'http:') {
          location.replace(`http:${location.href.substring(location.protocol.length)}`);
      }
  

  const [originalRows, setOriginalRows] = React.useState([]);
  const [searched, setSearched] = React.useState("");

  const requestSearch = (searchedVal) => {
    const filteredRowsNo = originalRows.filter((row) => {
      return row.no.toLowerCase().includes(searchedVal.toLowerCase());
    });
    const filteredRowsName = originalRows.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    //console.log(filteredRowsNo);
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
            a["api_no"],
            a["api_name"],
            a["url"],
            a["last_updated"],
            a["total_hits"],
            a["category"],
            a["status"],
            <AddCircleOutlineIcon
              className="cursor-pointer"
              onClick={() => {
                setModalAcno(a["api_no"]);
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  
   

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
                      <TableRow hover tabIndex={-1} key={row.api_no}>
                        <TableCell>{row.api_no}</TableCell>
                        <TableCell>{row.api_name}</TableCell>
                        <TableCell>{row.url}</TableCell>
                        <TableCell>{row.total_hits}</TableCell>
                        <TableCell>{row.last_updated}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.status}</TableCell>
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
            rowsPerPageOptions={[5,25, 50, 100,150]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <Modals
        show={modalShow}
        onHide={() => setModalShow(false)}
        acno={modalAcno}
      />
       {/* <AcnoDetails/> */}
    </div>
  );
}
