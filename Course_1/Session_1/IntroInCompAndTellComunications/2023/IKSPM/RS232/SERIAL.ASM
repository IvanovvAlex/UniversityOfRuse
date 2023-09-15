        name    serial
com1	equ	3f8h
com2	equ	2f8h

rbr     equ     com1
thr	equ	rbr
dll	equ	thr
ier	equ	rbr+1
dlm	equ	ier
iir	equ	rbr+2
lcr	equ	rbr+3
mcr	equ	rbr+4
lsr	equ	rbr+5
msr	equ	rbr+6

; simwoli za predawane
const1	equ	055h
const2	equ	0AAH

constanta	equ	const1

; bez kontrol tchenost / netchetnost
data1	equ	07h	; 8 bits, 2 stop bits
data2	equ	03h	; 8 bits, 1 stop bit
data3	equ	06h	; 7 bits, 2 stop bits
data4	equ	02h	; 7 bits, 1 stop bit

data	equ	data1
begin:
	mov	cx,0fffh	;broi powtorenia

; inicializacia
        mov     al,0
	mov	dx,ier
	out	dx,al	; zabrana na IRQ

; dostap do faktora na delene
        mov     al,87h
	mov	dx,lcr
	out	dx,al	; dostap do DLL i DLM

; zadawane na rabotnata skorost
	mov	al,0ch	; 9600 boda (bps)
	mov	dx,dll
	out	dx,al
	mov	al,0
	mov	dx,dlm
	out	dx,al	; zarejdane na rabotnata skorost

	mov	al,data ; format na protokola
	mov	dx,lcr
	out	dx,al	; opredeliane na protokola

et2	mov	al,constanta ; const za predawane
	mov	dx,thr
	out	dx,al	; predawane na simwol

et1     mov     dx,lsr
	in	al,dx
	and	al,40h
	jz	et1
; prowerka dali predawatelnia bufer e prazen

        loop    et2     ; prehod za predawane na sledwashtia simwol
	int	20h
        end


