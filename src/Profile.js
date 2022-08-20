import "./profile.css";
import { useAuthValue } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useEffect, useState } from "react";

import { storage } from "./firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

import ReactAudioPlayer from "react-audio-player";

function Profile() {
  const { currentUser } = useAuthValue();
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [data, setData] = useState([]);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const openModal = function () {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  const openFileModal = function () {
    const modal = document.querySelector(".fileModal");
    const overlay = document.querySelector(".overlay2");

    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
  };

  const closeModal = function () {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  const closeFileModal = function () {
    const modal = document.querySelector(".fileModal");
    const overlay = document.querySelector(".overlay2");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  document.addEventListener("keydown", function (e) {
    const modal = document.querySelector(".modal");

    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  const uploadFile = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please choose a file first!");
    } else {
      const storageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setData((arr) => [...arr, url]);
            closeFileModal();
            setFile("");
            setPercent(0);
          });
        }
      );
    }
  };

  const listItem = () => {
    const storageRef = ref(storage, `/files/`);

    listAll(storageRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          getDownloadURL(itemRef).then((url) =>
            setData((arr) => [...arr, url])
          );
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    listItem();
  }, []);

  const deleteFromFirebase = (url) => {
    let audioRef = ref(storage, url);
    deleteObject(audioRef)
      .then(() => {
        setData((arr) => arr.filter((item) => item !== url));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="center">
      <div className="profile">
        <h1>Profile</h1>
        <p>
          <strong>Email: </strong>
          {currentUser?.email}
        </p>
        <p>
          <strong>Email verified: </strong>
          {`${currentUser?.emailVerified}`}
        </p>
        <br />
        <span className="show-modal" onClick={openModal}>
          Access Database
        </span>
        <span className="logout" onClick={() => signOut(auth)}>
          Sign Out
        </span>
      </div>

      <div className="modal hidden">
        <div className="navbar">
          <h1>Audio Database</h1>
          <button className="uploader" onClick={openFileModal}>
            Upload
          </button>
        </div>
        <div className="body audio-body">
          {data.length > 0 ? (
            data.map((audioURL) => (
              <>
                <div className="row">
                  {audioURL && (
                    <ReactAudioPlayer
                      src={audioURL}
                      controls
                      style={{ width: "75%" }}
                    />
                  )}
                  <div className="buttons">
                    <button
                      className="delete"
                      onClick={() => deleteFromFirebase(audioURL)}
                    >
                      Delete
                    </button>
                    <button className="dummy">Dummy</button>
                  </div>

                  <br />
                </div>
                <div className="buttons-mob">
                  <button
                    className="delete"
                    onClick={() => deleteFromFirebase(audioURL)}
                  >
                    Delete
                  </button>
                  <button className="dummy">Dummy</button>
                </div>
              </>
            ))
          ) : (
            <>No audio files available</>
          )}
        </div>
      </div>

      <div className="fileModal hidden">
        <div className="navbar">
          <h1 style={{ marginBottom: "10px" }}>File Uploader</h1>
        </div>
        <div className="body">
          <form onSubmit={uploadFile}>
            <label>Select file:</label>
            <br />
            <input
              className="uploader"
              type="file"
              accept="audio/wav"
              onChange={handleChange}
            />
            <span>{file && <>Selected file: {file.name}</>}</span>
            <br />
            <button className="upload-file" disabled={percent > 0}>
              Upload file
            </button>
            <br />
            {percent === 100 ? (
              <p className="loader">Upload complete</p>
            ) : percent > 0 ? (
              <p className="loader">{percent}% done</p>
            ) : null}
            <br />
          </form>
        </div>
      </div>
      <div className="overlay2 hidden" onClick={closeFileModal}></div>
      <div className="overlay hidden" onClick={closeModal}></div>
    </div>
  );
}

export default Profile;
