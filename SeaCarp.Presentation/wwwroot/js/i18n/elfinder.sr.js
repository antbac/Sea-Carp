/**
* Serbian translation
* @author Momčilo m0k1 Mićanović <moki.forum@gmail.com>
* @version 2014-12-19
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['elfinder'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('elfinder'));
    } else {
        factory(root.elFinder);
    }
}(this, function (elFinder) {
    elFinder.prototype.i18.sr = {
        translator: 'Momčilo m0k1 Mićanović &lt;moki.forum@gmail.com&gt;',
        language: 'Srpski',
        direction: 'ltr',
        dateFormat: 'd.m.Y H:i',
        fancyDateFormat: '$1 H:i',
        messages: {
            /********************************** errors **********************************/
            'error': 'Greška',
            'errUnknown': 'Nepoznata greška.',
            'errUnknownCmd': 'Nepoznata komanda.',
            'errJqui': 'Neispravna konfiguracija jQuery UI. Komponente koje mogu da se odabiru, povlače, izbacuju moraju biti uključene.',
            'errNode': 'elFinder zahteva DOM Element da bude kreiran.',
            'errURL': 'Neispravna elFinder konfiguracija! URL opcija nije postavljena.',
            'errAccess': 'Pristup odbijen.',
            'errConnect': 'Nije moguće povezivanje s skriptom.',
            'errAbort': 'Veza prekinuta.',
            'errTimeout': 'Veza odbačena.',
            'errNotFound': 'Skripta nije pronađena.',
            'errResponse': 'Neispravan odgovor skripte.',
            'errConf': 'Neispravna konfiguracija skripte.',
            'errJSON': 'PHP JSON modul nije instaliran.',
            'errNoVolumes': 'Vidljivi volumeni nisu dostupni.',
            'errCmdParams': 'Nevažeći parametri za komandu "$1".',
            'errDataNotJSON': 'Podaci nisu JSON.',
            'errDataEmpty': 'Podaci nisu prazni.',
            'errCmdReq': 'Skripta zahteva komandu.',
            'errOpen': 'Nemoguće otvoriti "$1".',
            'errNotFolder': 'Objekat nije folder.',
            'errNotFile': 'Objekat nije datoteka.',
            'errRead': 'Nemoguće pročitati "$1".',
            'errWrite': 'Nemoguće pisati u "$1".',
            'errPerm': 'Dozvola je odbijena.',
            'errLocked': '"$1" je zaključan i nemože biti preimenovan, premešten ili obrisan.',
            'errExists': 'Datoteka zvana "$1" već postoji.',
            'errInvName': 'Neispravno ime datoteke.',
            'errFolderNotFound': 'Folder nije pronađen.',
            'errFileNotFound': 'Datoteka nije pronađena.',
            'errTrgFolderNotFound': 'Izabrani folder "$1" nije pronađen.',
            'errPopup': 'Pretraživač sprečava otvaranje iskačućih prozora. Da otvorite datoteku uključite iskačuće prozore u opcijama pretraživača.',
            'errMkdir': 'Nemoguće kreirati folder "$1".',
            'errMkfile': 'Nemoguće kreirati datoteku "$1".',
            'errRename': 'Nemoguće preimenovati datoteku "$1".',
            'errCopyFrom': 'Kopiranje datoteki sa "$1" nije dozvoljeno.',
            'errCopyTo': 'Kopiranje datoteki na "$1" nije dozvoljeno.',
            'errUpload': 'Greska pri slanju.',
            'errUploadFile': 'Nemoguće poslati "$1".',
            'errUploadNoFiles': 'Nisu pronađene datoteke za slanje.',
            'errUploadTotalSize': 'Podaci premašuju najveću dopuštenu veličinu.',
            'errUploadFileSize': 'Datoteka premašuje najveću dopuštenu veličinu.',
            'errUploadMime': 'Vrsta datoteke nije dopuštena.',
            'errUploadTransfer': '"$1" greška prilikom slanja.',
            'errNotReplace': 'Object "$1" already exists at this location and can not be replaced by object with another type.',
            'errReplace': 'Unable to replace "$1".',
            'errSave': 'Nemožeš sačuvati "$1".',
            'errCopy': 'Nemožeš kopirati "$1".',
            'errMove': 'Nemožeš premestiti "$1".',
            'errCopyInItself': 'Nemožeš kopirati "$1" na istu lokaciju.',
            'errRm': 'Nemožeš obrisati "$1".',
            'errRmSrc': 'Unable remove source file(s).',
            'errExtract': 'Nemoguće izvaditi datoteke iz "$1".',
            'errArchive': 'Nemoguće kreirati arhivu.',
            'errArcType': 'Nepodržani tip arhive.',
            'errNoArchive': 'Datoteka nije arhiva ili je nepodržani tip arhive.',
            'errCmdNoSupport': 'Skripta nepodržava ovu komandu.',
            'errReplByChild': 'Folder “$1” ne može biti zamenut stavkom koju sadrži.',
            'errArcSymlinks': 'Zbog bezbednosnih razloga ne možete raspakovati arhive koje sadrže simboličke veze ili datoteke sa nedozvoljenim imenima.',
            'errArcMaxSize': 'Arhiva je dostigla maksimalnu veličinu.',
            'errResize': 'Nemoguće promeniti veličinu "$1".',
            'errResizeDegree': 'Invalid rotate degree.',
            'errResizeRotate': 'Unable to rotate image.',
            'errResizeSize': 'Invalid image size.',
            'errResizeNoChange': 'Image size not changed.',
            'errUsupportType': 'nepodržan tip datoteke.',
            'errNotUTF8Content': 'Datoteka "$1" nije u UTF-8  formati i ne može biti izmenjena.',
            'errNetMount': 'Nije moguće montirati "$1".',
            'errNetMountNoDriver': 'Nepodržani protokol.',
            'errNetMountFailed': 'Montiranje neuspelo.',
            'errNetMountHostReq': 'Host je potreban.',
            'errSessionExpires': 'Your session has expired due to inactivity.',
            'errCreatingTempDir': 'Unable to create temporary directory: "$1"',
            'errFtpDownloadFile': 'Unable to download file from FTP: "$1"',
            'errFtpUploadFile': 'Unable to upload file to FTP: "$1"',
            'errFtpMkdir': 'Unable to create remote directory on FTP: "$1"',
            'errArchiveExec': 'Error while archiving files: "$1"',
            'errExtractExec': 'Error while extracting files: "$1"',

            /******************************* commands names ********************************/
            'cmdarchive': 'Kreiraj arhivu',
            'cmdback': 'Nazad',
            'cmdcopy': 'Kopiraj',
            'cmdcut': 'Iseci',
            'cmddownload': 'Preuzmi',
            'cmdduplicate': 'Dupliraj',
            'cmdedit': 'Izmeni datoteku',
            'cmdextract': 'Raspakuj arhivu',
            'cmdforward': 'Napred',
            'cmdgetfile': 'Izaberi datoteke',
            'cmdhelp': 'O ovom softveru',
            'cmdhome': 'Početna',
            'cmdinfo': 'Proveri informacije',
            'cmdmkdir': 'Novi folder',
            'cmdmkfile': 'Nova datoteka',
            'cmdopen': 'Otvori',
            'cmdpaste': 'Zalepi',
            'cmdquicklook': 'Pregledaj',
            'cmdreload': 'Povno učitaj',
            'cmdrename': 'Preimenuj',
            'cmdrm': 'Obriši',
            'cmdsearch': 'Pronađi datoteke',
            'cmdup': 'Idi na nadređeni folder',
            'cmdupload': 'Pošalji datoteke',
            'cmdview': 'Pogledaj',
            'cmdresize': 'Promeni veličinu slike',
            'cmdsort': 'Sortiraj',
            'cmdnetmount': 'Mount network volume',

            /*********************************** buttons ***********************************/
            'btnClose': 'Zatvori',
            'btnSave': 'Sačuvaj',
            'btnRm': 'Obriši',
            'btnApply': 'Potvrdi',
            'btnCancel': 'Prekini',
            'btnNo': 'Ne',
            'btnYes': 'Da',
            'btnMount': 'Mount',

            /******************************** notifications ********************************/
            'ntfopen': 'Otvaranje foldera',
            'ntffile': 'Otvaranje datoteke',
            'ntfreload': 'Ponovo učitavanje sadržaja foldera',
            'ntfmkdir': 'Kreiranje foldera',
            'ntfmkfile': 'Kreiranje datoteke',
            'ntfrm': 'Brisanje datoteke',
            'ntfcopy': 'Kopiranje datoteke',
            'ntfmove': 'Premeštanje datoteke',
            'ntfprepare': 'Priprema za kopiranje dateoteke',
            'ntfrename': 'Primenovanje datoteke',
            'ntfupload': 'Slanje datoteke',
            'ntfdownload': 'Preuzimanje datoteke',
            'ntfsave': 'Čuvanje datoteke',
            'ntfarchive': 'Kreiranje arhive',
            'ntfextract': 'Izdvajanje datoteka iz arhive',
            'ntfsearch': 'Pretraga datoteka',
            'ntfresize': 'Resizing images',
            'ntfsmth': 'Radim nešto >_<',
            'ntfloadimg': 'Učitavanje slike',
            'ntfnetmount': 'Montiranje mrežnog volumena',
            'ntfdim': 'Acquiring image dimension',

            /************************************ dates **********************************/
            'dateUnknown': 'nepoznat',
            'Today': 'Danas',
            'Yesterday': 'Sutra',
            'msJan': 'Jan',
            'msFeb': 'Feb',
            'msMar': 'Mar',
            'msApr': 'Apr',
            'msMay': 'Maj',
            'msJun': 'Jun',
            'msJul': 'Jul',
            'msAug': 'Avg',
            'msSep': 'Sep',
            'msOct': 'Okt',
            'msNov': 'Nov',
            'msDec': 'Dec',
            'January': 'Januar',
            'February': 'Februar',
            'March': 'Mart',
            'April': 'April',
            'May': 'Maj',
            'June': 'Jun',
            'July': 'Jul',
            'August': 'Avgust',
            'September': 'Septembar',
            'October': 'Oktobar',
            'November': 'Novembar',
            'December': 'Decembar',
            'Sunday': 'Nedelja',
            'Monday': 'Ponedeljak',
            'Tuesday': 'Utorak',
            'Wednesday': 'Sreda',
            'Thursday': 'Četvrtak',
            'Friday': 'Petak',
            'Saturday': 'Subota',
            'Sun': 'Ned',
            'Mon': 'Pon',
            'Tue': 'Uto',
            'Wed': 'Sre',
            'Thu': 'Čet',
            'Fri': 'Pet',
            'Sat': 'Sub',

            /******************************** sort variants ********************************/
            'sortname': 'po imenu',
            'sortkind': 'po vrsti',
            'sortsize': 'po veličini',
            'sortdate': 'po datumu',
            'sortFoldersFirst': 'Prvo folderi',

            /********************************** messages **********************************/
            'confirmReq': 'Potrebna potvrda',
            'confirmRm': 'Da li ste sigurni da želite da obrišete datoteke?<br/>Ovo se ne može poništiti!',
            'confirmRepl': 'Zameniti stare datoteke sa novima?',
            'apllyAll': 'Potvrdi za sve',
            'name': 'Ime',
            'size': 'Veličina',
            'perms': 'Dozvole',
            'modify': 'Izmenjeno',
            'kind': 'Vrsta',
            'read': 'čitanje',
            'write': 'pisanje',
            'noaccess': 'bez pristupa',
            'and': 'i',
            'unknown': 'nepoznato',
            'selectall': 'Izaberi sve datoteke',
            'selectfiles': 'Izaberi datoteku(e)',
            'selectffile': 'Izaberi prvu datoteku',
            'selectlfile': 'Izaberi poslednju datoteku',
            'viewlist': 'Popisni prikaz',
            'viewicons': 'Pregled ikona',
            'places': 'Mesta',
            'calc': 'Izračunaj',
            'path': 'Putanja',
            'aliasfor': 'Nadimak za',
            'locked': 'Zaključano',
            'dim': 'Dimenzije',
            'files': 'Datoteke',
            'folders': 'Folderi',
            'items': 'Stavke',
            'yes': 'da',
            'no': 'ne',
            'link': 'Veza',
            'searcresult': 'Rezultati pretrage',
            'selected': 'odabrane stavke',
            'about': 'O softveru',
            'shortcuts': 'Prečice',
            'help': 'Pomoć',
            'webfm': 'Web menađer datoteka',
            'ver': 'Verzija',
            'protocolver': 'verzija protokla',
            'homepage': 'Adresa projekta',
            'docs': 'Dokumentacija',
            'github': 'Forkuj nas na Github',
            'twitter': 'Prati nas na twitter',
            'facebook': 'Pridruži nam se na facebook',
            'team': 'Tim',
            'chiefdev': 'glavni programer',
            'developer': 'programer',
            'contributor': 'pomoćnik',
            'maintainer': 'održavatelj',
            'translator': 'prevodilac',
            'icons': 'Ikone',
            'dontforget': 'i ne zaboravite da ponesete peškir',
            'shortcutsof': 'Prečice isključene',
            'dropFiles': 'Prevucite datoteke ovde',
            'or': 'ili',
            'selectForUpload': 'Odaberite datoteke za slanje',
            'moveFiles': 'Premesti datoteke',
            'copyFiles': 'Kopiraj datoteke',
            'rmFromPlaces': 'Ukloni iz mesta',
            'aspectRatio': 'Omer širine i visine',
            'scale': 'Razmera',
            'width': 'Širina',
            'height': 'Visina',
            'resize': 'Promeni veličinu',
            'crop': 'Iseci',
            'rotate': 'Rotiraj',
            'rotate-cw': 'Rotiraj 90 stepeni CW',
            'rotate-ccw': 'Rotiraj 90 stepeni CCW',
            'degree': 'Stepeni',
            'netMountDialogTitle': 'Montiraj mrežni volumen',
            'protocol': 'Protokol',
            'host': 'Host',
            'port': 'Port',
            'user': 'Korisničko Ime',
            'pass': 'Lozinka',

            /********************************** mimetypes **********************************/
            'kindUnknown': 'Nepoznat',
            'kindFolder': 'Folder',
            'kindAlias': 'Nadimak',
            'kindAliasBroken': 'Neispravan nadimak',
            // applications
            'kindApp': 'Aplikacija',
            'kindPostscript': 'Postscript dokument',
            'kindMsOffice': 'Microsoft Office dokument',
            'kindMsWord': 'Microsoft Word dokument',
            'kindMsExcel': 'Microsoft Excel dokument',
            'kindMsPP': 'Microsoft Powerpoint prezentacija',
            'kindOO': 'Open Office dokument',
            'kindAppFlash': 'Flash aplikacija',
            'kindPDF': 'Portable Document Format (PDF)',
            'kindTorrent': 'Bittorrent datoteka',
            'kind7z': '7z arhiva',
            'kindTAR': 'TAR arhiva',
            'kindGZIP': 'GZIP arhiva',
            'kindBZIP': 'BZIP arhiva',
            'kindXZ': 'XZ arhiva',
            'kindZIP': 'ZIP arhiva',
            'kindRAR': 'RAR arhiva',
            'kindJAR': 'Java JAR datoteka',
            'kindTTF': 'True Type font',
            'kindOTF': 'Open Type font',
            'kindRPM': 'RPM paket',
            // texts
            'kindText': 'Teokstualni dokument',
            'kindTextPlain': 'Čist tekst',
            'kindPHP': 'PHP kod',
            'kindCSS': 'CSS kod',
            'kindHTML': 'HTML dokument',
            'kindJS': 'Javascript kod',
            'kindRTF': 'Rich Text Format',
            'kindC': 'C kod',
            'kindCHeader': 'C header kod',
            'kindCPP': 'C++ kod',
            'kindCPPHeader': 'C++ header kod',
            'kindShell': 'Unix shell skripta',
            'kindPython': 'Python kod',
            'kindJava': 'Java kod',
            'kindRuby': 'Ruby kod',
            'kindPerl': 'Perl skripta',
            'kindSQL': 'SQL kod',
            'kindXML': 'XML dokument',
            'kindAWK': 'AWK kod',
            'kindCSV': 'Comma separated values',
            'kindDOCBOOK': 'Docbook XML dokument',
            // images
            'kindImage': 'Slika',
            'kindBMP': 'BMP slika',
            'kindJPEG': 'JPEG slika',
            'kindGIF': 'GIF slika',
            'kindPNG': 'PNG slika',
            'kindTIFF': 'TIFF slika',
            'kindTGA': 'TGA slika',
            'kindPSD': 'Adobe Photoshop slika',
            'kindXBITMAP': 'X bitmap slika',
            'kindPXM': 'Pixelmator slika',
            // media
            'kindAudio': 'Zvuk',
            'kindAudioMPEG': 'MPEG zvuk',
            'kindAudioMPEG4': 'MPEG-4 zvuk',
            'kindAudioMIDI': 'MIDI zvuk',
            'kindAudioOGG': 'Ogg Vorbis zvuk',
            'kindAudioWAV': 'WAV zvuk',
            'AudioPlaylist': 'MP3 lista',
            'kindVideo': 'Video',
            'kindVideoDV': 'DV video',
            'kindVideoMPEG': 'MPEG video',
            'kindVideoMPEG4': 'MPEG-4 video',
            'kindVideoAVI': 'AVI video',
            'kindVideoMOV': 'Quick Time video',
            'kindVideoWM': 'Windows Media video',
            'kindVideoFlash': 'Flash video',
            'kindVideoMKV': 'Matroska video',
            'kindVideoOGG': 'Ogg video'
        }
    };
}));