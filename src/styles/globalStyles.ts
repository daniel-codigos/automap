import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 10,
    width: '100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  parteCard: {
    backgroundColor: '#FCDC94',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#ff7675',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  terminarButton: {
    backgroundColor: '#fdcb6e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  terminarButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default globalStyles;
