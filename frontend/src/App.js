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
  };

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
    this.setState({
      activeItem : {
        title : ''
      }
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
