import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckIcon from "@mui/icons-material/Check";
import DoneIcon from "@mui/icons-material/Done";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const [todoStyle, setTodoStyle] = useState("unfinished-todo-text");
  const navigate = useNavigate();

  const changeStyle = () => {
    setTodoStyle("finished-todo-text");
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const writeToDatabase = () => {
    var length = todo.length;
    if (length > 0) {
      const uidd = uid();
      set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
        todo: todo,
        finished: false,
        uidd: uidd
      });

      setTodo("");
    }
  };

  const handleDelete = (uid) => {
    remove(ref(db, `${auth.currentUser.uid}/${uid}`));
  };

  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
  };

  const handleEditConfirm = () => {
    update(ref(db, `${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo
      // tempUidd: tempUidd
    });
    setTodo("");
    setIsEdit(false);
  };

  const updateFinish = (uid) => {
    update(ref(db, `${auth.currentUser.uid}/${uid}`), {
      finished: true
    });
  };

  const revertFinish = (uid) => {
    update(ref(db, `${auth.currentUser.uid}/${uid}`), {
      finished: false
    });
  };

  return (
    <div className="homepage">
      <div className="add-sect">
        <input
          type="text"
          placeholder="Add todo..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />

        {isEdit ? (
          <div>
            <button onClick={handleEditConfirm}> Confirm </button>
          </div>
        ) : (
          <div>
            <button className="add-button" onClick={writeToDatabase}>
              {" "}
              Add task{" "}
            </button>
          </div>
        )}
      </div>
      <div className="todo-list">
        {todos.map((todo) => (
          <div className="todo">
            <EditIcon
              onClick={() => handleUpdate(todo)}
              className="edit-button"
            />
            <DeleteIcon
              onClick={() => handleDelete(todo.uidd)}
              className="delete-button"
            />
            {!todo.finished ? (
              <DoneIcon
                className="done-button"
                onClick={() => updateFinish(todo.uidd)}
              />
            ) : (
              <RotateLeftIcon
                className="revert-button"
                onClick={() => revertFinish(todo.uidd)}
              />
            )}
            {!todo.finished ? (
              <h1 className="unfinished-todo-text">{todo.todo}</h1>
            ) : (
              <h1 className="finished-todo-text">{todo.todo}</h1>
            )}
          </div>
        ))}
      </div>
      <div className="nav">
        <button onClick={handleSignOut}> Sign Out </button>
      </div>
    </div>
  );
}
