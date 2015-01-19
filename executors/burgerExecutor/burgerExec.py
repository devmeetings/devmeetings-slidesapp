# -*- coding: utf-8 -*-


def add(what, size=1):
    if size != 1:
        print("%d x %s" % (size, what))
    else:
        print(what)


def wyswietl(co, ile=1):
    dodaj(co, ile)


def dodaj(co, ile=1):
    if ile != 1:
        print("%d x %s" % (ile, co))
    else:
        print(co)


def dodajWszystkie(skladniki):
    map(dodaj, skladniki)


def wstaw(co, ile=1):
    dodaj(co, ile)


def burgerExec(code):
    exec(code, {
        'dodaj': dodaj,
        'wyswietl': wyswietl,
        'dodajWszystkie': dodajWszystkie,
        'wstaw': wstaw,
        'add': add
    })
