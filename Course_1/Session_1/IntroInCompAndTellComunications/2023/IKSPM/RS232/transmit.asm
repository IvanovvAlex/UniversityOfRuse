	name	TRANSLATION

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

; bez kontrol tchenost/netchetnost
data1	equ	07h	; 8 bits, 2 stop bits
data2	equ	03h	; 8 bits, 1 stop bit
data3	equ	06h	; 7 bits, 2 stop bits
data4	equ	02h	; 7 bits, 1 stop bit


begin:

; inicializacia

;zabrana na IRQ
	mov	al,0
	mov	dx,ier
	out	dx,al

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

; format na protokola
	mov	al,data1 ; format na protokola
	mov	dx,lcr
	out	dx,al	; opredeliane na protokola
;end init

;izchistwane na ekrana
	call	cls

et2	mov	ah,0
	int	16h
; tchetene ot KBD

	mov	ah,0eh
	int	10h
; echo na monitora

	mov	dx,thr
        out     dx,al
; predawane na simwola

	cmp	al,20h	;prowerka za krai
	jz	et3

et1     mov     dx,lsr
	in	al,dx
	and	al,20h	; thr=? swoboden li e?
	jz	et1
	jmp	et2

et3	int	20h

cls	push	cx
	mov	cx,50
	mov	ax,0e0ch
	int	10h
	mov	ax,0e0ah
cls1	int	10h
	loop	cls1
	mov	ah,2
	mov	dx,0202h
	int	10h
	pop	cx
	ret

	end

