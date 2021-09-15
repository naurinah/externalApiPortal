import { Button } from "@material-ui/core";
import Modal from "react-bootstrap/Modal";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(account, title, name, address, cell, email, ntn, cnic) {
  return { account, title, name, address, cell, email, ntn, cnic };
}


export default function CustomerModal({ show, onHide, acno }) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const fetchAccount = async (ac) => {
    let newRows = rows;
    const response = await fetch(
      `http://portal.blue-ex.com/api1/customerportal/viewprofile.py?acno=${ac}`
    ).then((res) => res.json());
    console.log(response.detail);
    if (newRows === []) {
      newRows = [
        createData(
          response.detail[0]["Account"],
          response.detail[0]["AccountTitle"],
          response.detail[0]["Name"],
          response.detail[0]["Address"],
          response.detail[0]["Cell"],
          response.detail[0]["Email"],
          response.detail[0]["NTN"],
          response.detail[0]["CNIC"]
        ),
      ];
    } else {
      newRows.push(
        createData(
          response.detail[0]["Account"],
          response.detail[0]["AccountTitle"],
          response.detail[0]["Name"],
          response.detail[0]["Address"],
          response.detail[0]["Cell"],
          response.detail[0]["Email"],
          response.detail[0]["NTN"],
          response.detail[0]["CNIC"]
        )
      );
    }
    setRows(newRows);
  };
  useEffect(async () => {
    if (acno !== undefined) {
      setRows([]);
      let acSplit = [""];
      acSplit = acno.split(",");
      if (acSplit !== undefined) {
        acSplit.map(async (a) => {
          if (a !== "") {
            await fetchAccount(a);
          }
        });
      }
    }
  }, [acno]);

  useEffect(() => {
    console.log("rows", rows);
  }, [rows]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Customer Related to this API
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {rows === [] ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Account</TableCell>
                  <TableCell>Account Title</TableCell>
                  <TableCell>Account Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Cell</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>NTN</TableCell>
                  <TableCell>CNIC</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows !== [] &&
                  rows.map((row) => (
                    <TableRow key={row.account}>
                      <TableCell component="th" scope="row">
                        {row.account}
                      </TableCell>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.address}</TableCell>
                      <TableCell>{row.cell}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.ntn}</TableCell>
                      <TableCell>{row.cnic}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
