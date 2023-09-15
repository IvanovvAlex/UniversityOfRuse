        name    transmit/receive

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

; natchalo na predawane i priemane

	mov	dx,rbr
	in	al,dx
; iztchistwane na RBR

	call	pozic
	mov	dx,0301h
	mov	poztranc,dx
	mov	dx,0329h
	mov	pozrec,dx


;   name     transmit

tranc2
	mov	ah,1
	int	16h
	jz	rec2
; prowerka za natisnat klawish, pri ne otwa kam prowerka za priemane po RS

; tchetena ot KBD

; nastroika poziciata na ekrana (monitora) pri predawane
	mov	dx,poztranc
	mov	ah,2
	int	10h

	mov	ah,0
	int	16h
; tchetene ot KBD
; waweden simbol "SPACE" , izhod ot programata
	mov	rabtranc,al

	mov	ah,0eh
	int	10h
; echo na monitora

	mov	dx,thr
        out     dx,al
; predawane na simwola po RS

; nastroika na poziciata za nowia simwol na ekrana (monitora) pri predawane
	mov	ah,3
	int	10h
	cmp	dl,38
	jbe	poztr1

	inc	dh
	mov	dl,1

poztr1	mov	poztranc,dx
;       jmp     poztr2

;       cmp     al,20h  ;prowerka za krai
;       jz      et3

tranc1  mov     dx,lsr
	in	al,dx
	and	al,20h	; thr=? swoboden li e?
; prowerka za swoboden THR

	jz	tranc1
;       jmp     tranc2 ; zacikliane na predawane

;   name    receive

rec2
	nop
rec1	mov	dx,lsr
	in	al,dx
; prowerka za priet simwol
; ????????? otchakwane na simwol po interfesa
	and	al,1
;       jz      rec1    ; tchaka simwol
	jz	tranc2

; protchitane na simwola
	mov	dx,rbr
	in	al,dx	; tchetene na simwola
	mov	rabrec,al

; ustanowiawane poziciata na kursora pri priemane
	mov	dx,pozrec
	mov	ah,2h
	int	10h

	mov	al,rabrec
	mov	ah,0eh
	int	10h	; echo na monitora

; ustanowiawane nowata pozicia na kursora pri priemane

	mov	ah,3h
	int	10h

	cmp	dl,78
	jbe	pozrec1

	inc	dh
	mov	dl,41

pozrec1 mov	pozrec,dx

	mov	al,rabrec
	cmp	al,20h
	jz	rec3	; prowerka za krai ??"SPACE"??

	jmp	rec2

rec3	int	20h


rabrec		db	?
rabtranc	db	?
pozrec		dw	?
poztranc	dw	?
text1	db	"DATA TRANSMIT$"
text2	db	"DATA RECEIVE$"


pozic:
	mov	dx,offset text1
	mov	ah,9
	int	21h
	mov	ah,3h
	int	10h
	add	dl,20
	mov	ah,2h
	int	10h
	mov	dx,offset text2
	mov	ah,9
	int	21h
	ret

cls	push	cx
	mov	cx,50
	mov	ax,0e0ch
	int	10h
	mov	ax,0e0ah
cls1	int	10h
	loop	cls1
	mov	ah,2
	mov	dx,0210h
	int	10h
	pop	cx
	ret

	end

