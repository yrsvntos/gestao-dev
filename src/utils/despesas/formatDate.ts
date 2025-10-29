export function formatDate(value?: Date | string) {
    if (!value) return "";
    if (value instanceof Date) return value.toLocaleDateString("pt-PT");
    return new Date(value).toLocaleDateString("pt-PT");
  }
  