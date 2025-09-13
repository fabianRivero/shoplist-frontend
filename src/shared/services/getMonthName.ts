import { capitalize } from "./capitalize";

interface Props {
    num: number;
    locale?: string;
    monthFormat?: "short" | "long" | "narrow" | "numeric" | "2-digit" | undefined;
}

export function getMonth({ num, locale = "es-ES", monthFormat = "long" }: Props ) {
    const date = new Date(2000, num - 1, 1);
    return capitalize(new Intl.DateTimeFormat(locale, { month: monthFormat }).format(date));
}