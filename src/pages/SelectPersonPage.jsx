import { useSearchParams, useNavigate } from "react-router-dom";
import SelectPerson from "../components/SelectPerson";

export default function SelectPersonPage(){
  const [sp] = useSearchParams();
  const q = sp.get("q") || "";
  const navigate = useNavigate();

  return (
    <SelectPerson
      query={q}
      onProceed={() => {
        // Aquí decide a dónde ir luego de seleccionar
        // Por ahora te devuelvo al /rsvp, pero puedes cambiarlo a /confirm, etc.
        navigate("/rsvp");
      }}
    />
  );
}
