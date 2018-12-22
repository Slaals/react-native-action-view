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

    state.rightButtons = props.rightButtons || [];
    state.leftButtons = props.leftButtons || [];

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
        style={this.props.style}
      >
        {
          this.state.rightButtons.length > 0 && this._drawButtons(this.props.leftButtons)
        }
        <View style={[styles.content, {flex: this.state.rightButtons.length}]}>
          {this.props.children}
        </View>
        {
          this.state.rightButtons.length > 0 && this._drawButtons(this.props.rightButtons)
        }
      </ScrollView>
    );
  }

  _drawButtons = (btns: ButtonProps[]) => {
    const width = Dimensions.get('window').width / (btns.length + 1);
    return (
      this.state.rightButtons.map((b, key) => (
        <TouchableOpacity key={key} onPress={() => this._onButtonTapped(b)} style={[styles.button, {backgroundColor: b.color, width}]}>
          <Text style={styles.buttonText}>{b.title}</Text>
        </TouchableOpacity>
      ))
    );
  }
}

const styles = StyleSheet.create({
  content: {
    width: Dimensions.get('window').width,
    maxWidth: Dimensions.get('window').width,
  },
  button: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  buttonText: {
    color: 'white',
  }
});
