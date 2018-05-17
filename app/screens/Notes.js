import React from "react";
import { AppRegistry, View, StatusBar, ListView } from "react-native";
import {
  Button,
  Text,
  Container,
  Card,
  CardItem,
  Body,
  Content,
  Header,
  Left,
  List,
  ListItem,
  Right,
  Icon,
  Title,
  Input,
  InputGroup,
  Item,
  Tab,
  Tabs,
  Footer,
  FooterTab,
  Label
} from "native-base";


export default class LucyChat extends React.Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {notes:[]};
  }

  componentDidMount() {
    this.getNotes();
  }

  async getNotes() {
    try {
      let response = await fetch(
        'https://sjcz7bvg5j.execute-api.us-east-1.amazonaws.com/dev/notes'
      );
      let responseJson = await response.json();
      this.setState({
        notes: responseJson
      });
    } catch (error) {
      console.error(error);
    }
  }

  createNote() {
    if (!this.state.noteTitle || !this.state.noteDescription) {
      return;
    }

    fetch('https://sjcz7bvg5j.execute-api.us-east-1.amazonaws.com/dev/notes', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.noteTitle,
        description: this.state.noteDescription,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.getNotes();
    })
    .catch((error) => {
      console.error(error);
    });
  }

  deleteNote(noteId) {
    console.log('deleting note', noteId)
    fetch(`https://sjcz7bvg5j.execute-api.us-east-1.amazonaws.com/dev/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  deleteRow(secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.notes];
    this.deleteNote(newData[rowId]._id);
    newData.splice(rowId, 1);
    this.setState({ notes: newData });
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Notes</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Item floatingLabel style={{ marginTop: 20 }}>
            <Label>Title</Label>
            <Input
              onChangeText={(noteTitle) => this.setState({noteTitle})}
            />
          </Item>
          <Item floatingLabel style={{ marginTop: 20 }}>
            <Label>Description</Label>
            <Input
              onChangeText={(noteDescription) => this.setState({noteDescription})}
            />
          </Item>
          <Button
            rounded
            danger
            style={{ marginTop: 20, alignSelf: "center" }}
            onPress={() => {
              this.createNote();
            }}
          >
            <Text>Add Note</Text>
          </Button>

          <Button
            rounded
            danger
            style={{ marginTop: 20, alignSelf: "center" }}
            onPress={() => this.setState({isLoggedIn: false})}
          >
            <Text>Logout</Text>
          </Button>

          <List
            dataSource={this.ds.cloneWithRows(this.state.notes)}
            renderRow={data =>
              <ListItem>
                <Text> {data.title} </Text>
              </ListItem>}
            renderLeftHiddenRow={data =>
              <Button full onPress={() => alert(data.description)}>
                <Icon active name="information-circle" />
              </Button>}
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
                <Icon active name="trash" />
              </Button>}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </Content>
      </Container>
    );
  }
}
