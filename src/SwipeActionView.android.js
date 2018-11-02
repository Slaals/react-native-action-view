'use strict'

import React, { Component } from 'react';

import {
  processColor,
  Dimensions,
  View,
  ViewProps,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface ButtonProps {
  title: string;
  color?: string;
  callback(): void;
}

interface Props extends ViewProps {
  rightButtons: ButtonProps[];
  leftButtons: ButtonProps[];
}


// TODO AJust scroll, only works width right buttons
export class SwipeActionView extends Component {
  constructor(props) {
    super(props);

    this._onButtonTapped = this._onButtonTapped.bind(this);
    this.state = this.stateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.stateFromProps(nextProps));
  }

  stateFromProps(props) {
    const state = {};

    if (props.rightButtons) {
      state.rightButtons = props.rightButtons;
    }

    if (props.leftButtons) {
      state.leftButtons = props.leftButtons;
    }

    return state;
  }

  _onButtonTapped(button) {
    this.refs._scrollView.scrollTo({x: 0, y: 0, animated: true});

    button.callback();
  }

  render() {
    return (
      <ScrollView
        ref="_scrollView"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
      >
        {
          (this.state.leftButtons && this.state.leftButtons.length > 0) &&
          this.state.leftButtons.map((b, key) => (
            <TouchableOpacity key={key} onPress={() => this._onButtonTapped(b)} style={[styles.button, {backgroundColor: b.color}]}>
              <Text style={styles.buttonText}>{b.title}</Text>
            </TouchableOpacity>
          ))
        }
        <View style={styles.content}>
          {this.props.children}
        </View>
        {
          (this.state.rightButtons && this.state.rightButtons.length > 0) &&
          this.state.rightButtons.map((b, key) => (
            <TouchableOpacity key={key} onPress={() => this._onButtonTapped(b)} style={[styles.button, {backgroundColor: b.color}]}>
              <Text style={styles.buttonText}>{b.title}</Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  button: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
  }
});
