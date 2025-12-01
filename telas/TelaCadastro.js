// telas/TelaCadastro.js
// importação
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native'; // INSERÇÃO: Alert para pop-up, Removida importação de AsyncStorage
import { useNavigation } from '@react-navigation/native'; // INSERÇÃO: Hook para navegar de volta
import { useUser } from '../src/context/UserContext';
// ...
import MaskInput, { Masks } from 'react-native-mask-input';


// exporta a função
export function TelaCadastro() {
    const { addUser } = useUser();
    const navigation = useNavigation(); // INSERÇÃO: Obtém o objeto de navegação

    //Definir estado inicial 
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');


    // REMOÇÃO: A função getUsuarios foi removida. O Context gerencia a busca.
    // ...

    // função para tratar o cadastro
    const handleCadastrar = async () => {
        // validação simples
        if (!nome || !cpf || !dataNascimento || !endereco || !telefone) {
            Alert.alert("Erro", "Preencha todos os campos antes de cadastrar!"); // MODIFICAÇÃO: Uso de Alert.alert em vez de alert simples
            return;
        }

        // REMOÇÃO: A geração do ID foi removida. O Context (addUser) agora a faz.

        // Criar o objeto do novo usuário
        const novoUsuario = {
            // REMOÇÃO: O 'id' não é mais incluído aqui
            nome: nome,
            cpf: cpf,
            dataNascimento: dataNascimento,
            endereco: endereco,
            telefone: telefone,
        };

        try {
            // MODIFICAÇÃO: Chama a função centralizada do Context para adicionar e salvar no AsyncStorage
            await addUser(novoUsuario);

            Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!'); // MODIFICAÇÃO: Uso de Alert.alert

            // Limpar o formulário
            setNome('');
            setCpf('');
            setDataNascimento('');
            setEndereco('');
            setTelefone('');

            // (INSERÇÃO: Navega de volta após o sucesso
            navigation.goBack();

        } catch (erro) {
            console.error('Erro ao salvar o usuário: ', erro);
            Alert.alert('Falha', 'Falha ao salvar o usuário. Tente novamente. '); // MODIFICAÇÃO: Uso de Alert.alert
        }
    };

    return (
        <ScrollView style={estilos.container}>
            <Text style={estilos.titulo}>Cadastro de Novo Usuário</Text>

            <Text style={estilos.rotulo}>Nome Completo:</Text>
            <TextInput
                style={estilos.entrada}
                value={nome}
                onChangeText={setNome}
                placeholder="Digite o nome"
            />

            <Text style={estilos.rotulo}>CPF:</Text>
            <MaskInput
                style={estilos.entrada}
                value={cpf}
                onChangeText={(masked, unmasked) => setCpf(masked)}
                mask={Masks.CPF}
                keyboardType="numeric"
                placeholder="000.000.000-00"
            />

            <Text style={estilos.rotulo}>Data de Nascimento (DD/MM/AAAA):</Text>
            <MaskInput
                style={estilos.entrada}
                value={dataNascimento}
                onChangeText={(masked, unmasked) => setDataNascimento(masked)}
                mask={MaskInput.DATE_DDMMYYYY}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
            />

            <Text style={estilos.rotulo}>Endereço:</Text>
            <TextInput
                style={estilos.entrada}
                value={endereco}
                onChangeText={setEndereco}
                placeholder="Rua, número, bairro"
            />

            <Text style={estilos.rotulo}>Telefone:</Text>
            <MaskInput
                style={estilos.entrada}
                value={telefone}
                onChangeText={(masked, unmasked) => setTelefone(masked)}
                mask={Masks.BRL_PHONE}
                keyboardType="numeric"
                placeholder="(00) 00000-0000"
            />

            <View style={estilos.botaoContainer}>
                <Button
                    title="CADASTRAR USUÁRIO"
                    onPress={handleCadastrar}
                    color="#28a745" // cor verde
                />
            </View>

        </ScrollView>
    );
}

// Estilos 
const estilos = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    titulo: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
        textAlign: 'center',
    },
    rotulo: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
        color: '#555555',
    },
    entrada: {
        height: 45,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    botaoContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
});
