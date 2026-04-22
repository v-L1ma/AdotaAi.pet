export type animal = {
    nome:string,
    imagem:string,
    genero:"M" | "F" | null,
    porte:"pequeno" | "medio" | "grande" | null,
    especie:"cachorro" | "gato" | null,
    localizacao?: string,
    bairro?: string,
    cidade?: string,
    uf?: string,
}