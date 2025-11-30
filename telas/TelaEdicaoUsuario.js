// telas/TelaEdicaoUsuario.js
// importação

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function TelaEdicaoUsuario({ route, navigation }) {
    // O parâmetro 'route' será usado para receber os dados do usuário a ser editado.
    const { usuario } = route.params || {};

    return (
        <View style={estilos.container}>
            <Text style={estilos.titulo}>Edição de Usuário</Text>
            <Text style={estilos.subtitulo}>Editando: {usuario ? usuario.nome: 'Nenhum usuário selecionado'}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitulo: {
        fontSize: 18,
        color: '#007bff',
    },
});