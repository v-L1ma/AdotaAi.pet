export type animal = {
    id?: string,
    nome:string,
    imagem:string,
    genero:"M" | "F" | null,
    porte:"pequeno" | "medio" | "grande" | null,
    especie:"cachorro" | "gato" | null
}