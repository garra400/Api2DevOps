# Dockerfile API Express

# 1. Imagem base
FROM node:22.16-alpine

# 2. Diretório de trabalho (criado como root)
WORKDIR /app

# 3. Copia os arquivos de dependência (ainda como root)
COPY package*.json ./

# 4. Instala as dependências (ainda como root)
# O npm tem permissão para criar /app/node_modules
RUN npm ci --omit=dev

# 5. Copia o resto do código da aplicação (ainda como root)
COPY . .

# 6. MUITO IMPORTANTE: Transfere a propriedade de todos os arquivos para o usuário 'node'
RUN chown -R node:node /app

# 7. AGORA sim, muda para o usuário não-privilegiado
USER node

# 8. Expõe a porta
EXPOSE 3000

# 9. Define o comando padrão, que será executado como 'node'
CMD ["npm", "start"]