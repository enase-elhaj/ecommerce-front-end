import { useNavigate } from 'react-router-dom';

// Higher-Order Component to pass navigate as a prop
export function withNavigate(Component) {
  return function Wrapper(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}