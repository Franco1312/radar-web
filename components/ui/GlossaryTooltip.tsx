import { useState } from "react";
import { InfoTooltip } from "./InfoTooltip";

interface GlossaryTooltipProps {
  term: string;
  children: React.ReactNode;
}

const glossaryTerms: Record<string, string> = {
  "Reservas": "Dólares del BCRA para estabilizar el tipo de cambio. Son el 'colchón' que permite intervenir en el mercado cambiario.",
  "Base monetaria": "Pesos en circulación + depósitos bancarios. Más base = más pesos en la economía, lo que puede presionar precios y dólar.",
  "Volatilidad": "Qué tanto 'salta' el precio de un día a otro. Más volatilidad = mayor incertidumbre en el corto plazo.",
  "Ratio Respaldo": "Relación entre reservas y base monetaria. Más alto = más respaldo en USD para cada peso en circulación.",
  "Tendencia": "Dirección del movimiento del dólar en el corto plazo comparado con su promedio reciente.",
  "Datos frescos": "Información actualizada recientemente. Datos más frescos permiten análisis más precisos.",
  "Cobertura": "Porcentaje de días con datos disponibles en un período. Menor cobertura = interpretar con más cautela.",
  "Delta": "Cambio o variación en un período específico (7 días, 30 días, etc.).",
  "MA14": "Promedio móvil de 14 días. Indica la tendencia de corto plazo.",
  "MA30": "Promedio móvil de 30 días. Indica la tendencia de mediano plazo.",
  "Percentil": "Valor que indica qué porcentaje de observaciones están por debajo. P30 = 30% de los valores son menores.",
  "FX": "Foreign Exchange - mercado de divisas donde se negocia el dólar.",
  "BCRA": "Banco Central de la República Argentina. Regula la política monetaria y cambiaria.",
  "Tipo de cambio": "Precio del dólar en pesos. Indica cuántos pesos se necesitan para comprar un dólar.",
  "Intervención": "Acción del BCRA para influir en el precio del dólar comprando o vendiendo divisas.",
  "Liquidez": "Cantidad de dinero disponible en la economía. Más liquidez puede presionar precios.",
  "Inflación": "Aumento generalizado de precios. Más pesos en circulación puede contribuir a la inflación.",
  "Shock": "Cambio brusco e inesperado en las condiciones económicas que puede afectar el mercado.",
  "Vulnerabilidad": "Grado de exposición a riesgos. Menos reservas = mayor vulnerabilidad cambiaria.",
  "Estabilidad": "Condición de equilibrio sin cambios bruscos. Objetivo de la política económica."
};

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const definition = glossaryTerms[term];
  
  if (!definition) {
    return <>{children}</>;
  }

  return (
    <InfoTooltip 
      title={term}
      description={definition}
    >
      {children}
    </InfoTooltip>
  );
}
