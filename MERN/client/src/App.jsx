import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");

  const [editingId, setEditingId] = useState("");

  useEffect(() => {

    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data);
      });
  
    }, []);

    const handleAddStudent = () => {
      axios
        .post("http://localhost:5000/students", {
          name: name,
          course: course,
          age: age
        })
        .then((response) => {
          setStudents([...students, response.data]);

          setName("");
          setCourse("");
          setAge("");
        })
        .catch((error) => {
          console.log("Error updating the student:", error.response?.data || error.message);
        });
    };

    const handleDelete = () => {
      axios
        .delete(`http://localhost:5000/students/${id}`)
        .then(() => {
          return axios.get("http://localhost:5000/students");
        })
        .then((response) => {
          setStudents(response.data);
        })
        .catch((error) => {
          console.log("Error deleting student:", error);
        });
    };

    const handleEdit = (student) => {
      setEditingId(student._id);
      setName(student.name);
      setCourse(student.course);
      setAge(student.age);
    };

    const handleUpdateStudent = () => {
      axios
        .put(`http://localhost:5000/students/${editingId}`, {
          name: name,
          course: course,
          age: age
        })
        .then(() => {
          return axios.get("http://localhost:5000/students");
        })
        .then((response) => {
          setStudents(response.data);

          setEditingId(null);

          setName("");
          setCourse("");
          setAge("")
        })
        .catch((error) => {
          console.log("Error updating the selected student:", error.response?.data || error.message);
        });
    };

  return (
    <div>
      
      <h1>Student Management System</h1>
      
      <h2>Add Student</h2>

      <form
      onSubmit={(event) => {
        event.preventDefault();

        if (editingId) {
          handleUpdateStudent();
        } else {
          handleAddStudent();
        }
      }}
      >

        <div>
          <label>Name: </label>
          <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          />
        </div>
        
        <div>
          <label>Course: </label>
          <input
          type="text"
          value={course}
          onChange={(event) => setCourse(event.target.value)}
          required
          />
        </div>

        <div>
          <label>Age: </label>
          <input
          type="number"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          required
          />
        </div>

        <button type="submit">
          {editingId ? "Update Student" : "Add Student"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
              setCourse("");
              setAge("")
            }}
          >
            Cancel
          </button>
        )}

      </form>

      <h2>Students</h2>

      {students.map((student) => (
        <div key={student.id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>

          <button onClick={ () => handleEdit(student) }>
            Edit
          </button>

          <button onClick={ () => handleDelete(student._id) }>
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;