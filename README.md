## Описание задачи

>Задача: реализовать одностраничное приложение с формой на React, в которую можно загрузить json файл (в том числе с использованием drag and drop).<br><br>Если формат json верный, то нужно рекурсивно посчитать и отобразить число объектов, если нет – сообщение об ошибке. Будет плюсом если получится учесть максимальное количество граничных кейсов.

## Описание реализации

- Array при подсчете считается объектом
- Доступна множественая згрузка файлов
- Принимаются файлы не более 1мб и с расширением файла .json или .txt
- Загрузка файлов, не соответствующих описанию пункту выше, или которые не смогли распарситься как JSON, вызывают сообщение об ошибке
- Если один или несколько файлов были успешко загружены, выводится список просмотра результатов, в котором выводится имя файла, количество объектов и ключи, по котором были найдены объекты.

## Собранное приложение

Доступно по ссылке: [https://random1911.github.io/JSON-Counter-4000/](https://random1911.github.io/JSON-Counter-4000/)