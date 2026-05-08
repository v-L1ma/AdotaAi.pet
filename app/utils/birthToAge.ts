export function birthToAge(birthDate: string): string {
  const [day, month, year] = birthDate.split("/").map(Number);

  const birth = new Date(year, month - 1, day);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  // Ajusta dias negativos
  if (days < 0) {
    months--;

    const lastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();

    days += lastMonth;
  }

  // Ajusta meses negativos
  if (months < 0) {
    years--;
    months += 12;
  }

  // Menor que 1 mês → retorna dias
  if (years === 0 && months === 0) {
    const diffMs = today.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return `${totalDays} Dia(s)`;
  }

  // Menor que 1 ano → retorna meses
  if (years === 0) {
    return `${months} Mês(es)`;
  }

  // 1 ano ou mais
  return `${years} Ano(s)`;
}