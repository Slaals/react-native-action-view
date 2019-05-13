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

  holdAction: boolean;
}


// TODO AJust scroll, only works width right buttons
export class SwipeActionView extends Component<ViewProps> {
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

    state.rightButtons = props.rightButtons ? props.rightButtons.reverse() : [];
    state.leftButtons = props.leftButtons ? props.leftButtons.reverse() : [];

    return state;
  }

  _onButtonTapped(button) {
    this.refs._scrollView.scrollTo({x: 0, y: 0, animated: true});

    button.callback();
  }

  _onLayout(layout) {
    this.setState({contentWidth: layout.nativeEvent.layout.width});
  }

  render() {
    return (
      <ScrollView
        ref="_scrollView"
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{flex: 1, flexGrow: 1}}
        onLayout={this._onLayout.bind(this)}
        contentContainerStyle={this.props.style}
        scrollEnabled={!this.props.holdAction}
      >
        {
          this.state.leftButtons.length > 0 && this._drawButtons(this.state.leftButtons)
        }

        {
          <View style={[styles.content, {width: this.state.contentWidth || Dimensions.get('window').width}]}>
            {this.props.children}
          </View>
        }

        {
          this.state.rightButtons.length > 0 && this._drawButtons(this.state.rightButtons)
        }
      </ScrollView>
    );
  }

  _drawButtons = (btns: ButtonProps[] = []) => {
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
  button: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  buttonText: {
    color: 'white',
  }
});
