#!/bin/sh

function show_help()
{
    echo ""
    echo "Usage:"
    echo ""
    echo "-d  | --deck          [deck-title] default is 'NO_NAME'"
    echo "-db | --database      [database-name] default is 'platform-development'"
    echo "-s  | --slides        [slides-path] path of slies to insert"
    echo "-h  | --help          Show help"
    echo ""
    echo "Slides are automatically inserted into deck"
    echo ""
}

DECK_TITLE="NO_NAME"
SLIDES_PATH=""
DATABASE_NAME="platform-development"

while [ "$1" != "" ]; do
    case $1 in
        -d  | --deck )          shift
                                DECK_TITLE=$1
                                ;;

        -db | --database )      shift
                                DATABASE_NAME=$1
                                ;;

        -s  | --slides )        shift
                                SLIDES_PATH=$1
                                ;;

        -h  | --help )          show_help
                                exit
                                ;;

    esac
    shift
done

if [ "$SLIDES_PATH" == "" ]; then
    show_help
    exit
else
    slides=`cat $SLIDES_PATH`
    
    js_code=`cat <<JS_CODE

    database = db.getSiblingDB('$DATABASE_NAME');
    slides_content = $slides;
    
    ids = [];
    slides = []
    slides_content.forEach( function (content) {
        slide = {
            _id: new ObjectId(),
            content: content
        }
        ids.push(slide._id.str);
        slides.push(slide);
    });

    database.slides.insert(slides);
    database.decks.insert( {title: '$DECK_TITLE', slides: ids});
    
    `

    RUN=`mongo --eval "$js_code"`
    echo $RUN

fi
