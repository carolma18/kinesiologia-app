import axios from "axios";

export interface SheetRow {
  date: string;
  registeredBy: string;
  id: string;
  rowIndex: number;
}

// =======================================================================
// === ¡IMPORTANTE! REEMPLAZA ESTOS VALORES CON LOS TUYOS REALES DE APICO Y GOOGLE SHEETS ===
// =======================================================================
const apicoIntegrationId: string = "vMmKHN"; // <--- TU ID DE INTEGRACIÓN APICO
const spreadSheetId: string = "1rW9ezOs3urwpv9khCjWvC6ND9bMyizmuaopuAovUsX4"; // <--- TU ID DE HOJA DE CÁLCULO DE GOOGLE
const sheetName: string = "Sheet1"; // <--- EL NOMBRE EXACTO DE LA PESTAÑA DE TU HOJA (ej. "Sheet1" o "Sesiones")
const sheetId: number = 113585014933885257987; // <--- EL GID DE LA PESTAÑA DE TU HOJA. ¡Copia el número largo de la URL!
// =======================================================================

const apiBaseUrl = `https://api.apico.dev/v1/${apicoIntegrationId}/${spreadSheetId}`;

// Prefijo para forzar que Google Sheets trate la fecha como texto
const DATE_PREFIX = ''; 

export const getSessions = async (): Promise<SheetRow[]> => {
  try {
    console.log("[sheets.ts] Realizando GET a la API:", `${apiBaseUrl}/values/${sheetName}`);
    const response = await axios.get(
      `${apiBaseUrl}/values/${sheetName}`
    );
    
    const rows: string[][] = response.data.values ? response.data.values.slice(1) : []; 
    console.log("[sheets.ts] Datos recibidos de la API (raw):", response.data.values);
    console.log("[sheets.ts] Filas procesadas (sin encabezado):", rows);

    return rows.map((row, idx) => {
      let date = row[0] || '';
      // Si la fecha tiene el prefijo, lo quitamos al leer
      if (date.startsWith(DATE_PREFIX)) {
        date = date.substring(DATE_PREFIX.length);
      }
      const registeredBy = row[1] || '';
      const id = row[2] || `${date}-${registeredBy}-${Date.now()}`;
      
      const rowIndex = idx + 2; 

      console.log(`[sheets.ts] Sesión mapeada: Fecha: ${date}, Registrado por: ${registeredBy}, ID: ${id}, RowIndex: ${rowIndex}`);
      return { date, registeredBy, id, rowIndex };
    });
  } catch (error) {
    console.error("[sheets.ts] Error al obtener sesiones:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("[sheets.ts] Detalles del error (response):", error.response.data);
      if (error.response.status === 404) {
          alert("Error de conexión a Apico: Verifica tu apicoIntegrationId o spreadSheetId.");
      }
    } else if (error instanceof Error) {
        console.error("[sheets.ts] Mensaje de error general:", error.message);
    }
    return [];
  }
};

export const addSession = async (
  date: string, // La fecha ya viene formateada 'yyyy-MM-dd' desde App.jsx
  registeredBy: string
): Promise<SheetRow | null> => {
  try {
    const sessionId = `${date}-${registeredBy}-${Date.now()}`;
    // Añadimos el prefijo a la fecha antes de enviarla
    const dataToAppend = [`${DATE_PREFIX}${date}`, registeredBy, sessionId]; 

    console.log("[sheets.ts] Datos a agregar (con prefijo):", dataToAppend);

    const options = {
      method: "POST",
      url: `${apiBaseUrl}/values/${sheetName}:append`,
      params: {
        valueInputOption: "RAW", // Usamos RAW para asegurar que el prefijo se mantenga
        insertDataOption: "INSERT_ROWS",
        includeValuesInResponse: true,
      },
      data: {
        values: [dataToAppend],
      },
    };

    const response = await axios(options);
    console.log("[sheets.ts] Respuesta de la API al agregar:", response.data);
    const updatedRange: string = response.data.updates.updatedRange;
    const rowIndex = parseInt(updatedRange.match(/\d+/g)![0]); 

    return { date, registeredBy, id: sessionId, rowIndex };
  } catch (error) {
    console.error("[sheets.ts] Error al agregar sesión:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("[sheets.ts] Detalles del error (response):", error.response.data);
    }
    return null;
  }
};

export const deleteSession = async (rowIndex: number): Promise<boolean> => {
  try {
    const range = {
      sheetId: sheetId,
      dimension: "ROWS",
      startIndex: rowIndex - 1, 
      endIndex: rowIndex, 
    };
    console.log(`[sheets.ts] Intentando eliminar fila en la hoja: startIndex=${range.startIndex}, endIndex=${range.endIndex}, sheetId=${range.sheetId}`);

    const options = {
      method: "POST",
      url: `${apiBaseUrl}:batchUpdate`,
      data: {
        requests: [
          {
            deleteDimension: {
              range,
            },
          },
        ],
      },
    };

    const response = await axios(options);
    console.log("[sheets.ts] Respuesta de la API de eliminación:", response.data);
    return true;
  } catch (error) {
    console.error("[sheets.ts] Error al eliminar sesión en la API:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("[sheets.ts] Detalles del error (response):", error.response.data);
    }
    return false;
  }
};