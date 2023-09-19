import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

// Componente Modal para exibir mensagens de erro em uma janela popup
function Modal({ show, onClose, children }) {
  if (!show) return null;

  return (
    <View>
      {children}
      <Button title="Fechar" onPress={onClose} />
    </View>
  );
}

const errorTranslations = {
  "Invalid IP Address": "Endereço de IP Inválido"
};

const translateError = (errorMessage) => {
  return errorTranslations[errorMessage] || errorMessage;
};

function App() {
  const [ip, setIp] = useState("");
  const [ipData, setIpData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userIp, setUserIp] = useState(null);

  const consultarIP = async (inputIp) => {
    try {
      const response = await axios.get(`https://ipapi.co/${inputIp}/json/`);

      if (response.data && response.data.error) {
        throw new Error(translateError(response.data.reason));
      }

      setIpData(response.data);
      setIsModalVisible(false);
    } catch (err) {
      setError(err.message || "Ocorreu um erro. Tente novamente.");
      setIsModalVisible(true);
    }
  };

  useEffect(() => {
    async function fetchUserIp() {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setUserIp(response.data.ip);
      } catch (error) {
        console.error("Erro ao obter IP do usuário:", error);
      }
    }

    fetchUserIp();
  }, []);

  return (
    <View>
      <Text>{userIp ? `Seu IP é ${userIp}` : 'Obtendo seu IP...'}</Text>
      <Text>Digite o IP a ser buscado:</Text>
      <TextInput
        value={ip}
        onChangeText={text => setIp(text)}
      />
      <Button title="Buscar" onPress={() => consultarIP(ip)} />

      {ipData && (
        <View>
          <Text><Text style={{ fontWeight: 'bold' }}>IP:</Text> {ipData.ip}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Cidade:</Text> {ipData.city}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Região:</Text> {ipData.region}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>País:</Text> {ipData.country_name}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Provedora:</Text> {ipData.org}</Text>
        </View>
      )}

      <Text>Integrantes do Grupo: João Nishikawa e Fábio de Assis</Text>

      <Modal show={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <Text>{error}</Text>
      </Modal>
    </View>
  );
}

export default App;