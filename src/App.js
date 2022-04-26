import { useState } from "react";
import './App.css'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, doc, deleteDoc, query, where, orderBy, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

function App() {

  const [name, setName] = useState('');
  const [author, setAuthor] = useState('')
  const [id, setId] = useState('')
  const [book, setBook] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userDetails, setUserDetails] = useState({})

  
  const firebaseConfig = {
    apiKey: "AIzaSyDDZSh6NvSsJlw0Lg9j_hO6DRIyEl1ZM-k",
    authDomain: "fir-learn-18ca9.firebaseapp.com",
    projectId: "fir-learn-18ca9",
    storageBucket: "fir-learn-18ca9.appspot.com",
    messagingSenderId: "261239301590",
    appId: "1:261239301590:web:9258f4d8fb3063be05b077"
  };

  initializeApp(firebaseConfig)

  const db = getFirestore()
  const auth = getAuth()

  //Referring books collection from firebase
  const collectionRef = collection(db, 'books')

  //Using getDocs to fetch collection data
  // getDocs(collectionRef).then((snapshot) => {
  //   const books = []
  //   snapshot.docs.forEach( (doc) => {
  //     books.push({ ...doc.data(), id: doc.id })
  //   })
  //   setBook(books)
  // })

  //To fetch particular data using query
  // const qry = query(collectionRef, where('author', '==', 'rudyard kepling') )
  // console.log('qry', qry)

  //To fetch data based on create time
  // const qry = query(collectionRef, orderBy('createdAt'))

  //Using onSnapshot to fetch collection data
  onSnapshot(collectionRef, (snapshot) => {
    const books = []
    snapshot.docs.forEach( (book) => {
      books.push({
        ...book.data(), id: book.id
      })
      console.log('books', books)
    })
  })
  
  //Referring a particular document
  const docRef = doc(db, 'books', 'HYMsEjDQCJyRKJzwiyYr')

  //Getting particular document data
  getDoc(docRef).then((doc) => {
    console.log('doc.data()', doc.data())
  })


  const handleAddbook = () => {
    if(!name || !author) {
      alert('Book name and author name is mandatory.')
    }
    
    addDoc(collectionRef, {
      name: name,
      author: author,
      createdAt: serverTimestamp()
    }).then( () => {
      setName('')
      setAuthor('')
    })
  }

  const handleDeleteBook = () => {
    if(!id) {
      alert('Book id mandatory.')
    }
    const docRef = doc(db, 'books', id)
    deleteDoc(docRef).then( () => {
      setName('')
      setAuthor('')
      setId('')
    })
  }

  const handleUpdateBook = () => {
    if(!id) {
      alert('book id is mandatory')
    }
    const docRef = doc(db, 'books', id)
    updateDoc(docRef, {
      name: name
    }).then( () => {
      setName('')
      setAuthor('')
      setId('')
    })
  }

  const handeSignup = () => { 

    if(!email || !password) {
      alert('email and password is required')
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setUserDetails(userCredential.user)
    })
    .catch((error) => {
      console.log('error.message', error.message)
    });
  }

  const handeSignin = () => {
    if(!email || !password) {
      alert('email and password is required')    
    } 

    signInWithEmailAndPassword(auth, email, password).then( (userCredential) => {
      setUserDetails(userCredential.user)
    }).catch((error) => {
      console.log('error', error)
    })

  }

  const handleLogOut = () => {
    signOut(auth).then(() => {
      console.log('User Logged out!')
    }).catch((error) => {
      console.log('error.message', error.message)
    })
  }

  onAuthStateChanged(auth, (user) => {
    console.log('onauthChanged: user', user)
  })

  console.log('book', book)

  return (
    <div className="App">
      <h3>FIREBASE V9 - CRUD</h3>
      <hr /><br />
      <div>
      { userDetails.uid ?
        <>  
          <p>User Logged In</p>
          <p>User Id : {userDetails.uid}</p>
          <p>User Email Id : {userDetails.email}</p>
          <button type="submit" onClick={handleLogOut}>Log Out</button>
        </> : 
        <>
          <div className="sign-up">
            <label htmlFor="email">  Email  </label><br />
            <input type="text" value={email} id='email' onChange={(event) => setEmail(event.target.value)} /> <br />
            <label htmlFor="password">  password  </label><br />
            <input type="password" value={password} id='password' onChange={(event) => setPassword(event.target.value)} /> <br /><br />
            <button type="submit" className="btn btn-primary" onClick={handeSignup}>Sign up</button> OR
            <button type="submit" className="btn btn-primary" onClick={handeSignin}>  Sign In</button>
          </div>
        </> 
      }
      </div>   <hr /><br />
      <div>
        <label htmlFor="name">Add a book name</label><br />
        <input type="text" id='name' value={name} onChange={(event) => setName(event.target.value)} />
        <br />
        <label htmlFor="author">Add a book author</label><br />
        <input type="text" id='author' value={author} onChange={(event) => setAuthor(event.target.value)} />
        <br /><br />
        <button type="submit" className="btn btn-primary" onClick={handleAddbook}>Add a book</button><br /><br />
        <hr/>
      </div>

      <div>
        <label htmlFor="id">Enter the id to delete book</label><br />
        <input type="text" value={id} id='id' onChange={(event) => setId(event.target.value)} /><br /><br />
        <button type='submit'  className="btn btn-danger" onClick={handleDeleteBook}>delete Book</button><br />
        <hr />
      </div>

      <div>
        <label htmlFor="name">Enter a book name</label><br />
          <input type="text" id='name' value={name} onChange={(event) => setName(event.target.value)} />
        <br />
        <label htmlFor="update">Enter the book id to update</label> <br/>
        <input type="text" value={id} id={id} onChange={(event) => setId(event.target.value)} /><br />
        <button type="submit" className="btn btn-primary" onClick={handleUpdateBook}>Update Book</button>
      </div> <hr /><br />
    </div>
  );
}

export default App;
