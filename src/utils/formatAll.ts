import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import moment from "moment";
export const formatValores = (number: number) => {
  const numberFormated = new Intl.NumberFormat("en-US").format(number);

  return numberFormated;
};

export const formatNumber = (number: number) => {
  const numberFormated = new Intl.NumberFormat("Pt-br").format(number);

  return numberFormated;
};

export const formatDate = (date: Date) => {
  return moment(date).locale("pt-br").format("DD MMM YYYY HH:mm:ss");

};
