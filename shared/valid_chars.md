emails: ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$
name: ^[A-Za-z-]+$

must have at least 12 chars or more and 4 numbers or more

password: ^(?=(?:.\*\d){4,})[\x21-\x7E]{12,}$ // doesn't allow space, but from ASCII '!' to '~'
