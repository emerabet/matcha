FROM mysql/mysql-server:5.7
WORKDIR /mysql
COPY db_matcha.sql /docker-entrypoint-initdb.d/
#RUN mysql -uroot -pShopShop db_matcha < db_matcha.sql
ENV MYSQL_ROOT_PASSWORD=ShopShop
ENV MYSQL_DATABASE=db_matcha

EXPOSE 3306
