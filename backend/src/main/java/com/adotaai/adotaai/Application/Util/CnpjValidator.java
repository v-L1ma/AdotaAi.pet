package com.adotaai.adotaai.Application.Util;

public class CnpjValidator {

    public static boolean isValid(String cnpj) {
        if (cnpj == null) {
            return false;
        }

        // Remove todos os não dígitos
        cnpj = cnpj.replaceAll("[^0-9]", "");

        if (cnpj.length() != 14) {
            return false;
        }
        if (cnpj.matches("(\\d)\\1{13}")) {
            return false;
        }

        try {
            int soma = 0;
            int peso = 2;
            for (int i = 11; i >= 0; i--) {
                soma += (cnpj.charAt(i) - '0') * peso;
                peso = (peso == 9) ? 2 : peso + 1;
            }
            int r = soma % 11;
            char dig13 = (r < 2) ? '0' : (char) ((11 - r) + '0');

            soma = 0;
            peso = 2;
            for (int i = 12; i >= 0; i--) {
                soma += (cnpj.charAt(i) - '0') * peso;
                peso = (peso == 9) ? 2 : peso + 1;
            }
            r = soma % 11;
            char dig14 = (r < 2) ? '0' : (char) ((11 - r) + '0');

            return (dig13 == cnpj.charAt(12)) && (dig14 == cnpj.charAt(13));
        } catch (Exception e) {
            return false;
        }
    }
}
