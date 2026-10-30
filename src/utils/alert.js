import { Alert, Platform } from 'react-native';

export function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    // Web: usa o alert nativo do navegador
    window.alert(`${title}\n\n${message}`);
    // Se houver botões, executa por padrão o onPress do primeiro botão não-cancelar (ou o primeiro)
    if (buttons && buttons.length > 0) {
      const confirmBtn = buttons.find(b => b.style !== 'cancel') || buttons[0];
      if (confirmBtn?.onPress) confirmBtn.onPress();
    }
    return;
  }

  // Android / iOS: usa o Alert nativo
  Alert.alert(title, message, buttons);
}