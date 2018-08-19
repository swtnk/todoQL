import { h, Component } from 'preact';
import style from './style';
import List from '../list';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const ADD_TODO = gql`
  mutation AddTodo($content: String!, $isChecked: Boolean!) {
    addTodo(content:$content, isChecked:$isChecked ) {
    id
    content
    isChecked
    }
  }
`;

const GET_TODOS = gql`
  query {
    todos{
      id
      content
      isChecked
    }
  }
`;

export default class ListHeader extends Component {

    state = {
        todoText: ""
    }

    constructor(props) {
        super(props);

        this.handleOnInputChange = this.handleOnInputChange.bind(this);
    }

    handleOnInputChange(event) {
        this.setState({
            todoText: event.target.value
        })
    }


    render() {

        return (
            <Mutation 
                mutation={ADD_TODO}
                update={(cache, {data: {addTodo}}) => {
                    const results = cache.readQuery({ query: GET_TODOS });


                    cache.writeQuery({
                      query: GET_TODOS,
                      data: { todos: addTodo }
                    });
                }}
            >

            {(addTodo, { data }) => (
                <div>
                    <input type="text" value={this.state.todoText} onChange={this.handleOnInputChange}/>
                    
                    <button 
                        onClick={e => {
                          addTodo({ variables: { content: this.state.todoText, isChecked: false} });
                          this.setState({todoText: ""});
                        }}
                    >
                        Add
                    </button>
                </div>
            )}
               
            </Mutation>
        )
    }


}