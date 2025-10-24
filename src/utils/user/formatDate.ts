// utils/formatDate.ts
export function formatDate(timestamp?: any) {
    if (!timestamp) return "";
    if (timestamp.toDate) return timestamp.toDate().toLocaleDateString("pt-PT");
    return timestamp; // se já for string
  }
  
