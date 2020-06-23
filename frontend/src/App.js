import React from 'react';
import './App.css';

class App extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {
      todoList:[],
      activeItem:{
        id: null,
        title: '',
        completed: false
      },
      editing: false,
    }

    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
  };

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  componentDidMount(){
    this.fetchTasks();
  }

  fetchTasks(){
    console.log('Fetching ...')

    fetch("http://127.0.0.1:8000/api/task-list/")
    .then(response => response.json())
    .then(data => 
      // console.log(data)
      this.setState({ todoList:data })
          );
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    // console.log('Name', name);
    // console.log('Value', value);

    this.setState({
      activeItem:{
        title: value
      }
    })

  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.activeItem);

    const csrftoken = this.getCookie('csrftoken');

    const url = 'http://127.0.0.1:8000/api/task-create/';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks();
      this.setState({
        activeItem : {
          title : ''
        }
      })
  
    }).catch((error) => {
      console.log('Error: ', error)
    })
  }

  render(){
    const tasks = this.state.todoList;
    return(
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{flex: 6}}>
                  <input onChange={this.handleChange} className="form-control" id="title" type="text" name="title" value={this.state.activeItem.title} placeholder="Add Task..."></input>
                </div>

                <div style={{flex: 1}}>
                  <button onClick={this.handleSubmit} id="submit" className="btn btn-warning" type="submit" name="Add" placeholder="Add">Add</button>
                </div>
              </div>
            </form>
          
          </div>

          <div id="list-wrapper">
            {tasks.map( (task, index) => 
              <div key={index} className="task-wrapper flex-wrapper">
                <div style = {{flex: 7}}>
                  <span>{task.title}</span>
                </div>

                <div style = {{flex: 1}}>
                  <button className="btn btn-sm btn-outline-info">Edit</button>
                </div>

                <div style = {{flex: 1}}>
                  <button className="btn btn-sm btn-outline-dark delete">-</button>
                </div>
                
              </div>
            )}
          </div>
        </div>
        
      </div>
    )
  }
}

export default App;
