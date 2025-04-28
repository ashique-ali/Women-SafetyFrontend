import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logoText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  betaText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: 'grey',
  },
  title: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  flag: {
    width: 30,
    height: 20,
    resizeMode: 'cover',
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#9C27B0',
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
