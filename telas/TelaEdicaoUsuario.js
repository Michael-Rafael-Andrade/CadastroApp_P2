// telas/TelaEdicaoUsuario.js
// importação

import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaskInput, { Masks } from 'react-native-mask-input';
import { useUser } from '../src/context/UserContext';
import { useTheme } from '../src/context/ThemeContext';

export function TelaEdicaoUsuario({ route, navigation }) {
    // O parâmetro 'route' será usado para receber os dados do usuário a ser editado.

    const { usuario } = route.params;
    const { theme } = useTheme();
    const { editUser, users } = useUser();



    // Pré-preenchimento do estado atual
    const [nome, setNome] = useState(usuario.nome);
    const [cpf, setCpf] = useState(usuario.cpf);
    const [dataNascimento, setDataNascimento] = useState(usuario.dataNascimento);
    const [endereco, setEndereco] = useState(usuario.endereco);
    const [telefone, setTelefone] = useState(usuario.telefone);

    // Lógica para Salvar a Edição
    const handleSalvarEdicao = async () => {
        // Validação Simples
        if (!nome || !cpf || !dataNascimento || !endereco || !telefone) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        // Objeto do usuário editado (mantendo o ID original!)
        const usuarioEditado = {
            id: usuario.id, // CRUCIAL: Mantém o ID original
            nome: nome,
            cpf: cpf,
            dataNascimento: dataNascimento,
            endereco: endereco,
            telefone: telefone,
        };

        try {
            await editUser(usuarioEditado);

            Alert.alert('Sucesso', 'Dados do usuário atualizados!');

            // Voltar para a tela de lista após a edição
            navigation.goBack();

        } catch (erro) {
            console.error('Erro ao salvar a edição:', erro);
            Alert.alert('Erro', 'Falha ao salvar as alterações.');
        }
    };


    return (
        <ScrollView style={[estilos.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[estilos.titulo, { color: theme.colors.text }]}>Editando: {usuario.nome}</Text>
            <Text style={[estilos.subtitulo, { color: theme.colors.text }]}>ID: {usuario.id}</Text>

            {/* Campo NOME */}
            <Text style={[estilos.rotulo, { color: theme.colors.text }]}>Nome Completo:</Text>
            <TextInput
                style={[estilos.entrada, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
                value={nome}
                onChangeText={setNome}
            />

            {/* Campo CPF (Usando máscara) */}
            <Text style={[estilos.rotulo, { color: theme.colors.text }]}>CPF:</Text>
            <MaskInput
                style={[estilos.entrada, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
                value={cpf}
                onChangeText={(masked, unmasked) => setCpf(masked)}
                mask={Masks.CPF}
                keyboardType="numeric"
            />

            {/* Campo DATA DE NASCIMENTO (Usando máscara dd/mm/aaaa) */}
            <Text style={[estilos.rotulo, { color: theme.colors.text }]}>Data de Nascimento:</Text>
            <MaskInput
                style={[estilos.entrada, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
                value={dataNascimento}
                onChangeText={(masked, unmasked) => setDataNascimento(masked)}
                mask={Masks.DATE_DDMMYYYY}
                keyboardType="numeric"
            />

            {/* Campo ENDEREÇO */}
            <Text style={[estilos.rotulo, { color: theme.colors.text }]}>Endereço:</Text>
            <TextInput
                style={[estilos.entrada, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
                value={endereco}
                onChangeText={setEndereco}
            />

            {/* Campo TELEFONE (Usando máscara) */}
            <Text style={[estilos.rotulo, { color: theme.colors.text }]}>Telefone:</Text>
            <MaskInput
                style={[estilos.entrada, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
                value={telefone}
                onChangeText={(masked, unmasked) => setTelefone(masked)}
                mask={Masks.BRL_PHONE}
                keyboardType="numeric"
            />

            {/* Botão de Salvar Edição */}
            <View style={estilos.botaoContainer}>
                <Button
                    title="SALVAR ALTERAÇÕES"
                    onPress={handleSalvarEdicao}
                    color={theme.colors.primary}
                />
            </View>
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    titulo: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
        textAlign: 'center',
    },
    subtitulo: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    rotulo: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
        color: '#555',
    },
    entrada: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    botaoContainer: {
        marginTop: 30,
        marginBottom: 40,
    }
});