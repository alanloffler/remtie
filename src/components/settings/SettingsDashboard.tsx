// App
import { useNavigate, useSearchParams } from 'react-router-dom';
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function SettingsDashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const c = searchParams.get('c');
    const t = searchParams.get('t');
  
    return (
      <div>
        <h1>search params</h1>
        <p>Category: {c}</p>
        <p>Type: {t}</p>
        <button onClick={() => navigate(`${APP_URL}/?t=venta&c=casa`)}>VER ALLPRODUCTOS</button>
        <button onClick={() => navigate(`${APP_URL}/productos/?t=alquiler&c=departamento`)}>VER ALLPRODUCTOS</button>
      </div>
    );
}
// Export React component
export default SettingsDashboard;