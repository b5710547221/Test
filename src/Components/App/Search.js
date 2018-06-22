import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { Button } from 'native-base'
import { SearchIcon } from '../Common/Icon'
// simport { SearchBar } from 'react-native-elements'
import SearchBar from 'react-native-search-box';

export default class Search extends Component {
    render() {
        const { searchText, searchStatus, onToggle } = this.props
        return (
            <View style={styles['Container']}>
            <TouchableOpacity onPress={onToggle} style={styles['Button']}>
                {false ?
                    <SearchBar style={styles['Search_Bar']}/> : 
                    SearchIcon
                    
                }
            </TouchableOpacity>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1
    },
    Button: {
        flex: 1,
    },
    Search_Bar: {
        flex: 1
    }
})

