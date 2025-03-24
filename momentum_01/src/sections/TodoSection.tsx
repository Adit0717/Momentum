"use client";

import "material-icons/iconfont/material-icons.css";
import { useEffect, useRef, useState } from "react";

function TodoSection() {
    const [optionsDropdown, setOptionsDropdown] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setOptionsDropdown((prev) => !prev);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                headerRef.current &&
                !headerRef.current.contains(event.target as Node)
            ) {
                setOptionsDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [headerRef]);

    const [addNewTaskInputValue, setAddNewTaskInputValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddNewTaskInputValue(e.target.value);
    };

    const addTask = () => {
        alert(`New task: ${addNewTaskInputValue}`);
        // TODO: Implement actual add-task logic
        setAddNewTaskInputValue("");
    };

    return (
        <div className="h-full w-full flex flex-col overflow-scroll no-scrollbar">
            {/* Top Header bar Fixed */}
            <div
                ref={headerRef}
                className="backdrop-blur-md sticky top-0 z-10 "
            >
                <div className="w-full flex items-center justify-between ps-4 pe-2 py-4">
                    <div className="text-4xl ">All Tasks</div>
                    <button
                        onClick={toggleDropdown}
                        className="h-12 w-12 rounded-full flex justify-center items-center hover:bg-gray-100"
                    >
                        {optionsDropdown ? (
                            <span className="material-icons">close</span>
                        ) : (
                            <span className="material-icons">more_vert</span>
                        )}
                    </button>
                </div>

                {/* Options Dropdown */}
                {optionsDropdown && (
                    <div className="w-full flex flex-col transition-all duration-300">
                        <a
                            onClick={() => alert("option1 clicked")}
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer"
                        >
                            Option 1
                        </a>
                        <a
                            onClick={() => alert("option2 clicked")}
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer"
                        >
                            Option 2
                        </a>
                        <a
                            onClick={() =>
                                alert("Show completed tasks clicked")
                            }
                            className="p-2 px-4 hover:bg-gray-100 cursor-pointer"
                        >
                            Show completed tasks
                        </a>
                    </div>
                )}
            </div>

            {/* Temp text placeholder */}
            <div className="hidden">
                In proident fugiat officia Lorem exercitation consequat fugiat
                labore fugiat. Nulla et sit culpa pariatur Lorem tempor
                adipisicing cillum amet anim velit enim. Reprehenderit fugiat
                elit nisi nisi proident officia adipisicing nisi commodo
                incididunt ut amet voluptate. Proident aute occaecat in
                excepteur do enim consequat mollit consectetur duis non cillum
                nulla. Duis nisi id amet commodo qui non sit laborum consequat
                officia non culpa magna dolore. Proident ad Lorem deserunt esse
                sint et Lorem ullamco non in minim commodo occaecat. Cupidatat
                ullamco velit duis fugiat elit culpa excepteur. Ea mollit dolore
                et anim magna. Ullamco eu sunt occaecat sint irure id laboris in
                labore ea ex ullamco velit do. Lorem do minim id aliqua velit
                nulla exercitation ex cillum labore pariatur. Ut eu fugiat
                labore tempor id reprehenderit nostrud sunt esse sint deserunt.
                Excepteur mollit officia fugiat mollit sit culpa id aliqua.
                Adipisicing ea in officia deserunt et cillum Lorem officia
                laboris non quis ad id sint. Quis nulla irure ut excepteur Lorem
                veniam. Pariatur cupidatat consectetur cupidatat. Lorem
                adipisicing Lorem non culpa id proident id. Veniam in sit sunt
                aute sit ea aute incididunt deserunt. Laborum tempor non aliqua
                esse non Lorem Lorem ut deserunt aliqua. In exercitation
                adipisicing nostrud anim reprehenderit incididunt aliqua
                occaecat velit tempor id dolore elit aliquip culpa. Sit eu enim
                occaecat et excepteur nulla cupidatat nulla tempor sunt
                incididunt. Sunt dolore labore qui laborum velit qui consectetur
                anim exercitation. Anim aute veniam et qui veniam tempor eu
                mollit consectetur. Officia ipsum est duis ipsum id
                reprehenderit mollit velit duis reprehenderit aliquip occaecat.
                Ea magna in deserunt amet velit. Velit nisi velit eiusmod. Enim
                nisi excepteur irure cupidatat ullamco nostrud anim pariatur
                ullamco Lorem est officia quis ut. Aliqua ipsum veniam magna
                dolore nisi. Voluptate laborum est elit do Lorem nisi ad eu
                irure eiusmod nostrud magna. Officia ex exercitation dolore
                proident. Magna ipsum consectetur proident exercitation. Fugiat
                occaecat ullamco commodo ipsum. Culpa non anim fugiat in tempor
                enim cillum ad. Est ex cupidatat commodo commodo in ipsum tempor
                irure sint ad do cillum enim. Ad laborum ipsum esse ex sit.
                Fugiat Lorem nulla officia aute nulla eiusmod magna voluptate
                consequat mollit ex ipsum sint. Consectetur ad irure
                adipisicing. Aute occaecat magna in laboris pariatur nulla.
                Dolore labore laborum sunt qui. Culpa id ut incididunt amet anim
                ex magna aute amet. Amet amet aliquip incididunt occaecat ut
                officia dolor et fugiat magna culpa. Exercitation mollit tempor
                aliquip sit sint occaecat quis do. Duis reprehenderit eu ea
                incididunt elit do. Dolore ut irure qui quis nulla in Lorem
                aliqua sunt incididunt. Do in commodo do mollit enim sit. Eu non
                et do incididunt excepteur ex ullamco sit do dolore excepteur
                amet eiusmod enim. Qui consequat pariatur officia adipisicing eu
                in eiusmod. Officia sit velit minim anim aute ipsum enim ullamco
                cillum ea commodo laboris. Ad ullamco laborum commodo esse ad
                consequat nostrud. Id id esse exercitation culpa. Et proident
                Lorem sit adipisicing et ullamco adipisicing nostrud. Esse
                laboris quis est cupidatat occaecat incididunt. Aliqua amet
                magna dolore nisi. Et magna in dolore esse. Deserunt minim
                tempor fugiat eiusmod ut deserunt commodo magna. Qui ipsum minim
                sit. Non amet eiusmod deserunt fugiat pariatur sit pariatur
                deserunt ullamco id sint adipisicing. Ullamco laboris eiusmod
                in. Non tempor minim enim ad aute aute incididunt occaecat
                veniam minim duis in cillum. Enim minim dolor adipisicing ut do
                culpa dolor reprehenderit. Labore esse sunt labore proident sint
                et nisi proident. Commodo duis sunt magna voluptate cillum
                laboris reprehenderit velit officia do. Sunt ad aliqua
                incididunt magna nisi Lorem irure esse dolore dolore. Ad quis
                quis cupidatat culpa fugiat. Eu magna anim proident consequat
                pariatur eiusmod pariatur eu incididunt dolor. Dolore officia
                reprehenderit cillum Lorem non. Ex velit occaecat in laborum
                magna non do incididunt. Ullamco enim nulla deserunt nostrud
                laboris laboris cillum id. Excepteur amet nulla nulla commodo
                mollit ex amet elit cillum anim sunt est eu do adipisicing. Quis
                ea enim ullamco esse ex incididunt. Quis pariatur anim esse
                mollit sint sint ea non fugiat ut voluptate aute. Tempor sint
                excepteur magna amet sunt non magna mollit. Adipisicing aliquip
                aute veniam tempor id labore occaecat ad commodo. Irure sunt
                ullamco cillum et exercitation incididunt anim tempor officia id
                sit qui voluptate. Nulla dolore sint nulla do dolore sit. Est id
                veniam pariatur nulla commodo enim do veniam nulla occaecat.
                Velit laboris ut nisi. Excepteur nulla sit deserunt consequat
                consequat tempor nostrud eiusmod sunt nulla cillum. Officia
                excepteur ut amet nulla adipisicing qui in qui cillum fugiat
                aliqua enim. Duis qui id pariatur eu ipsum commodo deserunt
                nulla laborum. Ullamco id ea enim culpa commodo labore eu sint
                aute officia ad enim proident amet. Voluptate reprehenderit ut
                labore consectetur labore nulla commodo aliquip ad velit.
                Laborum esse nisi exercitation incididunt aliqua in deserunt in
                ex excepteur commodo elit incididunt proident ut. Excepteur elit
                dolore ea nulla dolore exercitation ipsum non aliquip dolore.
                Sit enim fugiat esse quis. Id duis adipisicing voluptate qui
                nisi amet pariatur magna et eiusmod sint. Qui pariatur dolore
                mollit do. Pariatur do do duis. Sint officia ea eiusmod cillum
                fugiat. Non do officia consequat et officia do fugiat nulla in
                est ipsum nostrud ex. Voluptate incididunt quis sit in
                reprehenderit excepteur et cupidatat. Qui anim ut id
                exercitation est anim nisi est quis fugiat minim nostrud. Elit
                non laboris nostrud. Commodo adipisicing adipisicing esse
                laborum laboris in minim occaecat esse mollit id officia irure
                dolore. Sunt excepteur qui laboris laborum ea irure pariatur id
                aute sit ad quis eiusmod ad. Velit aliqua consequat qui sit. Non
                ad quis nostrud dolor exercitation exercitation proident ad est.
                Sit reprehenderit duis et reprehenderit sint anim. Nulla commodo
                deserunt eu sunt occaecat nisi. Veniam esse aliqua quis aliqua.
                Id ut dolor exercitation deserunt velit enim veniam eu proident.
                Sit dolore voluptate tempor cillum magna quis sit in esse ea
                cupidatat id excepteur quis. Aliquip officia consectetur in ut.
                Adipisicing minim consequat tempor exercitation veniam
                consectetur mollit. Officia qui pariatur labore commodo
                reprehenderit ullamco. Proident mollit reprehenderit aute dolore
                dolore laborum aliquip ea Lorem ullamco deserunt occaecat
                laboris officia. Do proident officia aliqua laboris ad eu
                eiusmod voluptate labore occaecat ea velit consequat.
                Adipisicing Lorem amet tempor laboris cillum esse est fugiat
                quis magna anim. Aliquip ex do cillum id. Id deserunt magna et.
                Aliquip laboris irure non irure et commodo est nostrud officia
                eu qui velit labore. Eiusmod incididunt adipisicing quis sit
                eiusmod. Dolore elit veniam ea fugiat eu deserunt consectetur ea
                proident officia. Velit sit quis qui nisi. Enim exercitation
                deserunt magna. Aliqua qui cupidatat incididunt cupidatat est
                sint irure exercitation id do qui cupidatat. Enim ipsum ad est
                sit sint. Labore aute aliqua magna cillum velit incididunt ut
                laboris. Ex dolore culpa laboris duis mollit consequat ut cillum
                aliquip do aliquip quis laborum nostrud. Et ad nulla esse non
                culpa adipisicing veniam nulla quis amet irure irure sint ipsum
                exercitation. Fugiat proident culpa est enim. Sit cillum
                exercitation sit ad do qui. Non ad non nulla minim do
                consectetur sint adipisicing duis occaecat eiusmod dolor irure
                anim incididunt. Consectetur id ullamco consectetur irure ea
                incididunt sit sit incididunt proident excepteur anim. Dolor
                occaecat officia laboris reprehenderit do cillum deserunt esse
                labore sunt occaecat. Cupidatat est officia ut quis deserunt
                voluptate sunt eiusmod laborum. Nostrud non et minim aliquip
                nulla aliqua dolore culpa exercitation irure ea minim
                exercitation mollit. Minim irure ipsum ad officia qui. Ullamco
                sint nulla sit. Veniam nulla dolore ipsum do dolore ullamco
                irure consequat tempor. Cillum consequat anim id in irure ipsum
                sint ea et ea laboris nisi velit. Irure incididunt labore
                incididunt sit laborum in dolore. Amet cupidatat eu voluptate
                labore incididunt pariatur in eiusmod aliquip. Id magna velit
                labore elit ullamco. Velit sit nulla consectetur ex nulla
                laborum eiusmod ullamco sit eu incididunt elit mollit. Voluptate
                aliquip consequat irure laboris nisi veniam laboris aute cillum
                elit. Cupidatat labore sit adipisicing consequat dolor aute.
                Ullamco eu mollit ullamco labore enim veniam nostrud id aute
                velit ad cillum laborum veniam. Culpa commodo commodo eiusmod id
                est excepteur laborum amet eiusmod aliqua. Nulla sunt esse
                commodo eiusmod. Culpa consequat deserunt laborum sit commodo
                exercitation nulla. Ut et aliquip ea. Sunt ipsum ullamco
                cupidatat dolor. Tempor officia anim aliqua amet sint aute esse
                magna irure exercitation enim consectetur duis veniam
                exercitation. Culpa est dolor deserunt consectetur fugiat
                adipisicing culpa. Tempor proident labore cillum cillum esse
                enim quis commodo et magna elit elit velit. Cillum non in
                excepteur eu consequat id commodo ea ex sint ex Lorem. Pariatur
                exercitation ex ad anim non incididunt non qui reprehenderit
                incididunt culpa veniam veniam eu veniam. Est ad ut aliquip do.
                Esse ea aliquip deserunt Lorem aliqua. Cillum non cillum id qui
                enim duis ullamco elit laboris in deserunt aliqua eiusmod mollit
                velit. Excepteur ipsum velit velit elit aliquip ex. Fugiat
                adipisicing veniam sint veniam mollit quis laboris sint labore
                et irure dolor tempor. Id magna anim exercitation amet non
                laborum. Sint ut sit deserunt voluptate esse voluptate. Aliqua
                irure nulla ipsum laborum esse enim pariatur non elit ullamco ex
                id. Cupidatat non est esse officia voluptate culpa elit
                adipisicing laborum id fugiat deserunt tempor ullamco minim.
                Nisi irure reprehenderit proident Lorem esse minim. Sint duis
                aliquip excepteur amet. Mollit culpa mollit incididunt commodo
                ea dolore id commodo id. Veniam enim sunt eu laborum proident
                consequat in quis esse velit mollit cillum commodo. Enim mollit
                proident nulla adipisicing do consequat ullamco sit aliquip esse
                duis. Nisi veniam ut pariatur. Tempor adipisicing excepteur
                exercitation sit sunt commodo eu adipisicing. Elit cupidatat
                minim laboris irure deserunt consectetur est proident aute eu
                velit eu est anim. Aute qui adipisicing esse ex esse proident.
                Magna magna enim mollit sit ad anim pariatur culpa adipisicing
                ea sunt duis cillum mollit. Est mollit dolor non qui elit
                ullamco tempor dolor do cupidatat id veniam. Nulla elit esse
                aute sunt sit voluptate est sit laboris. Sint voluptate sint
                nostrud. Et aute labore ad pariatur ea ipsum ad nostrud sit
                fugiat ad ad. Proident velit consectetur sit ullamco anim labore
                ullamco sit. Exercitation in do est ut minim duis nostrud
                pariatur. Nulla aliquip consectetur laboris nisi ullamco ad do
                eiusmod aute aliquip reprehenderit elit. Enim officia ut cillum
                nostrud deserunt ipsum occaecat. Quis in fugiat fugiat nisi
                excepteur eiusmod sit ex nulla ipsum officia nulla id
                incididunt. Id quis elit laborum sit est eu enim ex non. Irure
                et ea minim culpa nulla pariatur minim labore excepteur fugiat
                ad dolore reprehenderit laborum ullamco. Tempor minim qui aute
                est velit culpa. Proident non et esse pariatur commodo id eu
                adipisicing duis sit magna tempor. Fugiat laboris minim
                reprehenderit elit deserunt. Consectetur pariatur sit et amet
                laboris esse ut ea dolore tempor non amet ex quis. Laboris nisi
                laborum sint duis magna in ex aliqua consequat fugiat dolore
                incididunt ipsum duis. Voluptate eu laborum sint ex occaecat
                officia aliqua sint commodo ex. Veniam aliquip ipsum excepteur
                excepteur nostrud duis in qui quis exercitation ut in. Fugiat
                sint do et enim velit fugiat dolore adipisicing deserunt
                consectetur veniam do sit. Deserunt culpa magna ad consequat
                minim cillum. Qui mollit sit ullamco voluptate commodo quis
                velit voluptate deserunt in culpa labore quis ut. Id do
                consectetur id. Esse in ex quis nostrud anim reprehenderit
                voluptate nostrud consequat ipsum sit veniam. Ea culpa elit sunt
                ipsum sit nostrud nostrud adipisicing occaecat. Ut nulla
                consectetur et non fugiat culpa in aliquip velit sunt cillum.
                Voluptate aliquip qui veniam pariatur id deserunt in eiusmod
                proident ad magna dolore laboris aliquip. Consectetur ad dolore
                magna commodo aliqua consequat irure. Cupidatat consequat duis
                tempor nisi aute nulla qui occaecat Lorem tempor consectetur.
                Aute minim nostrud anim ipsum esse nulla id commodo pariatur
                voluptate amet non. Nulla do est sint exercitation nisi in sint
                exercitation aliqua duis exercitation exercitation id velit.
                Esse reprehenderit eiusmod proident est nulla sint. Consectetur
                cupidatat elit nostrud incididunt do do ut Lorem non excepteur
                ipsum incididunt reprehenderit enim. Velit consectetur
                consectetur nisi. Qui laborum et et mollit dolor nostrud veniam
                aliquip in cillum. Sit enim do aliqua exercitation excepteur ex
                ex in Lorem ullamco irure ut consectetur. Ea dolor sint culpa
                ullamco minim laborum ex minim do ad occaecat exercitation do
                sint nulla. Ullamco tempor pariatur ex ipsum. Esse laborum nisi
                enim elit tempor aute dolor adipisicing laboris nisi in occaecat
                ea anim. Consectetur proident quis esse labore labore commodo
                elit. Exercitation excepteur ea cupidatat labore aliquip
                deserunt laborum dolor consectetur aliqua sit. Exercitation
                nostrud cupidatat eu irure cupidatat quis sit ea veniam.
                Proident amet eiusmod consequat in ut ipsum voluptate laboris
                nisi ea ea non. Voluptate laboris non irure voluptate incididunt
                nostrud culpa anim ut. Voluptate et tempor voluptate velit
                aliquip non aliqua incididunt sint dolore pariatur nisi. Quis
                velit aliquip ullamco non laborum elit cillum ipsum consequat
                anim dolore qui quis. Ad eiusmod amet ea dolor eu Lorem. Dolore
                ipsum eu culpa ea. Minim ullamco mollit elit sit pariatur minim
                id exercitation aliqua amet in cillum sunt proident. Aliqua
                Lorem enim sunt elit fugiat. In incididunt irure ipsum ad cillum
                sit minim tempor non minim. Duis deserunt proident cupidatat est
                consectetur ad laboris ullamco proident tempor mollit sit minim.
                Aliquip irure eu elit nisi nostrud fugiat occaecat in occaecat
                occaecat. Sunt fugiat ullamco veniam nostrud. Ex velit nostrud
                aute nulla esse tempor elit. Consequat aliqua magna ipsum
                nostrud eu laborum consectetur mollit. Irure adipisicing est id
                aliquip duis nostrud anim dolor exercitation laboris labore
                esse. Enim quis incididunt occaecat mollit excepteur ut
                voluptate laborum proident elit velit culpa deserunt. Ea officia
                voluptate magna cillum cupidatat qui eiusmod nulla incididunt
                magna. Consequat aliqua culpa fugiat aliquip dolore veniam
                consequat cupidatat dolore consectetur eu do occaecat. In irure
                laborum ullamco. Labore occaecat nulla eiusmod consectetur amet
                dolor proident. Est sit duis culpa et sit. Labore commodo ea id
                proident commodo voluptate pariatur aliqua nostrud exercitation
                culpa elit velit aliquip. Duis pariatur enim nulla. Proident et
                mollit dolore. Minim pariatur nulla esse consequat qui sunt
                aliqua cillum esse. Occaecat et laborum sit mollit ex do aute.
                Dolore exercitation ipsum dolor ea magna laboris excepteur. Non
                proident veniam adipisicing cillum non laboris sunt excepteur
                esse ipsum aliquip Lorem mollit dolor amet. Sunt in quis
                excepteur aliquip non. Elit veniam dolore quis. Ex sit est sunt
                dolore quis nostrud ipsum qui consequat sit. Amet eu laboris
                anim consectetur cupidatat. Veniam consectetur non anim ullamco
                esse et exercitation elit quis dolor incididunt minim ut laboris
                pariatur. In adipisicing labore ex sint aliquip ad amet
                incididunt ex ullamco anim aliquip incididunt exercitation
                adipisicing. Eu ad ut sint consequat anim incididunt velit.
                Pariatur aliqua id nisi velit deserunt quis eu aliquip ut elit
                reprehenderit sunt ullamco minim. Cupidatat sit consequat
                ullamco mollit ipsum consectetur ut id esse elit elit veniam
                nulla. Consequat veniam consequat eu veniam proident ut
                reprehenderit irure amet deserunt proident aliqua. Deserunt
                minim amet quis tempor reprehenderit aliquip commodo amet ut
                nisi qui ipsum qui veniam. Est do ut laboris occaecat do laborum
                eu et esse ad ea exercitation. Laboris nostrud incididunt non
                dolor sit. Qui ex deserunt culpa Lorem ut. Laboris eu amet
                pariatur. Ipsum non ullamco sint laborum proident et ullamco
                pariatur aliquip sint aute elit. Laboris nostrud laborum officia
                nisi deserunt deserunt culpa laborum elit aute cupidatat aliqua
                voluptate amet. Nostrud elit consequat et reprehenderit fugiat
                deserunt duis mollit eu et irure pariatur cupidatat. Laboris ad
                enim magna commodo sint occaecat ut culpa magna sint eiusmod
                mollit. Esse sunt eu nostrud incididunt laboris. Mollit laboris
                magna ullamco laborum id nisi sunt ex fugiat magna aliquip.
                Labore reprehenderit anim deserunt voluptate aliquip do.
                Occaecat elit pariatur fugiat anim labore id non cupidatat culpa
                anim et. Quis voluptate elit minim ut ad mollit aliquip ad
                commodo non duis quis labore occaecat sunt. Anim commodo ullamco
                consequat consectetur deserunt anim exercitation. Lorem magna
                sint labore nulla ut deserunt duis culpa. Amet Lorem non
                reprehenderit minim excepteur consequat sint ex labore eu id
                quis ex est proident. Incididunt occaecat labore nostrud amet
                cillum aliqua in aute fugiat. Est sint culpa labore dolor qui
                nisi nulla nisi. Lorem laboris minim aute. Proident occaecat
                ullamco voluptate deserunt mollit nulla ad ex officia officia
                consequat qui cupidatat consectetur et. Quis mollit proident
                consequat fugiat esse ex aliquip nostrud dolore cupidatat. Nulla
                et anim quis consequat labore. Do ad in ut deserunt aliquip
                occaecat magna laboris deserunt eu proident aliquip aliqua ipsum
                deserunt. Exercitation mollit id non consequat nisi. Consequat
                voluptate duis magna exercitation mollit velit anim quis. Fugiat
                velit excepteur esse aliquip quis in et ut ea eiusmod sint aute
                consequat ullamco. Cillum laborum dolor anim esse ut commodo ex
                ullamco exercitation magna eu. Magna do sit officia est nostrud
                enim labore proident nisi anim. Amet reprehenderit sint
                consequat consectetur sunt sit enim occaecat sunt. Aute veniam
                culpa fugiat esse tempor. Et anim aliqua aliquip reprehenderit
                voluptate cupidatat ad eiusmod aliquip. Laboris fugiat irure
                commodo officia aliquip anim qui excepteur aute laboris in nulla
                reprehenderit et. Sit eu sit pariatur aute mollit magna quis
                pariatur mollit. Mollit enim pariatur nulla nulla adipisicing
                incididunt eiusmod fugiat. Dolore est fugiat id elit in ad quis
                culpa incididunt cupidatat dolor mollit reprehenderit. Ullamco
                enim nostrud laboris est cillum ut Lorem do velit culpa Lorem ut
                nisi. Aliqua id culpa fugiat Lorem exercitation aliqua in
                aliquip ea. Lorem cupidatat nisi enim elit voluptate nulla quis
                reprehenderit enim deserunt minim velit adipisicing. Duis labore
                non sunt nostrud excepteur eu dolor dolore nulla culpa id. Enim
                ipsum laboris sunt officia elit sint ad eiusmod dolor duis
                tempor amet consequat. Sint laboris culpa qui nisi consectetur.
                Est irure incididunt deserunt anim enim cupidatat ut culpa
                incididunt aliqua pariatur incididunt minim quis voluptate. Elit
                sit cillum amet eu sit voluptate nisi enim aute. Elit laborum
                exercitation cillum veniam labore. Elit qui eiusmod enim ullamco
                velit aliquip deserunt esse. Magna sunt fugiat duis aute esse
                non occaecat non voluptate in cillum velit eiusmod incididunt.
                Veniam eiusmod reprehenderit qui adipisicing eiusmod est do.
                Excepteur elit enim exercitation nulla nulla do amet sunt ex
                commodo aute veniam sunt. Do qui ullamco non excepteur in. In
                dolor sint anim quis dolore eu quis. Consequat tempor Lorem anim
                est dolor duis aliquip eiusmod fugiat. Labore dolore excepteur
                nulla enim ut eu. Consequat Lorem esse dolor tempor id id ut
                elit proident duis quis tempor aliquip aute. Ad ex occaecat et
                exercitation ipsum elit commodo ea cupidatat officia et qui
                aliquip. Reprehenderit do deserunt voluptate culpa quis et
                laboris cillum elit do laboris mollit labore. Lorem in labore
                sint voluptate incididunt veniam ex magna mollit dolore nisi
                veniam deserunt qui ea. Ut cillum nulla nostrud nulla duis. Ex
                eiusmod aliquip dolor ex proident aute culpa cillum irure ipsum
                sunt enim. Dolor consectetur id incididunt elit minim. Ex nisi
                sit enim veniam fugiat dolore proident tempor nostrud qui. Eu
                pariatur eiusmod eu est eu veniam qui cupidatat enim aute labore
                velit in qui proident. Elit quis adipisicing ullamco minim anim.
                Eu laborum ad ex ipsum Lorem et cupidatat ea enim anim consequat
                Lorem est consequat. Cillum incididunt magna minim ipsum
                excepteur proident ut quis veniam ut adipisicing ut. Sint veniam
                enim deserunt anim in incididunt incididunt. Et sint irure
                cupidatat exercitation irure sint in aute officia elit fugiat.
                Exercitation occaecat commodo non culpa enim culpa dolor eiusmod
                anim cillum dolor. Esse amet ullamco nostrud tempor aliqua
                occaecat aliqua amet occaecat proident eiusmod nisi dolore.
                Officia laborum ut laboris cupidatat et est ad consectetur.
                Minim eiusmod cupidatat deserunt esse ut deserunt enim
                reprehenderit velit id qui duis. Voluptate consequat ex velit
                quis minim est nisi laborum magna ipsum eu irure ut aliqua
                consectetur. Occaecat sit ad in velit ullamco. Do Lorem sint et
                non dolor fugiat sit labore cillum. Labore esse do aliqua aute
                aliquip ipsum amet fugiat ea adipisicing eu Lorem enim. Et quis
                eiusmod ea. Exercitation deserunt Lorem ipsum adipisicing veniam
                minim dolore veniam ad id quis. Enim est et quis aliqua ipsum
                laboris. Cupidatat pariatur veniam dolor aliqua deserunt labore
                nostrud. Veniam tempor ut eu mollit sint consectetur nisi
                nostrud ut sit occaecat. Esse minim id excepteur ea veniam
                occaecat Lorem incididunt exercitation proident excepteur duis
                do cupidatat consectetur. Ullamco minim qui eiusmod fugiat. Esse
                sit Lorem id eu magna. Est sint veniam excepteur. Et
                reprehenderit consectetur sit qui eiusmod duis. Exercitation do
                laborum aute voluptate. Elit incididunt aute esse sunt enim
                eiusmod id. Excepteur duis amet sunt occaecat ad veniam. In
                magna velit sunt incididunt eu ea consectetur magna. Elit
                eiusmod pariatur deserunt nostrud cupidatat dolore minim ullamco
                est tempor ea mollit deserunt. Sit tempor ex labore cillum
                dolore anim qui consequat aute amet. Eiusmod duis ad in
                excepteur tempor aute velit. Eiusmod cillum et excepteur aute
                ullamco aliqua labore deserunt. Amet laboris sit dolor
                adipisicing exercitation aliquip occaecat mollit consectetur
                minim. Mollit id mollit labore pariatur tempor. Consequat veniam
                ipsum ipsum ad adipisicing minim. Laborum cupidatat irure qui.
                Cillum excepteur ex excepteur aute enim velit labore est eu sunt
                cillum quis adipisicing aliqua amet. Ullamco officia veniam
                quis. Ea nulla minim reprehenderit fugiat mollit ipsum. Non
                cupidatat non ipsum fugiat eu quis ipsum Lorem nostrud in veniam
                consectetur velit ad anim. Fugiat velit reprehenderit Lorem
                occaecat cillum commodo ipsum in. Consectetur aute deserunt
                proident ex aute quis. In ullamco ex consequat minim veniam et.
                Do ut consectetur nisi duis veniam eiusmod adipisicing anim
                ipsum eiusmod dolore cupidatat non. Velit nostrud ea et sint
                fugiat eu sit sint. Nostrud consectetur tempor laborum elit amet
                in. Et et enim pariatur. Dolor incididunt in dolor ea in sint
                nisi nostrud irure dolore nulla non eu ea anim. Minim et ad
                irure qui nisi ad nostrud aliquip. Minim cupidatat incididunt eu
                incididunt eiusmod sit. Cupidatat nisi cupidatat culpa enim. Qui
                id eiusmod dolore. Occaecat id mollit ea dolore est esse. Fugiat
                culpa eiusmod sunt sunt sint ullamco eiusmod id voluptate aute
                quis consectetur. Sint incididunt occaecat laborum sint est non
                dolor deserunt adipisicing. Officia est irure sint proident elit
                mollit ullamco commodo anim. Mollit sunt aliquip mollit nisi ut
                cillum eiusmod voluptate proident irure. Officia non non officia
                labore. Incididunt pariatur deserunt aliquip nulla sunt laboris
                aute aliqua. Non sunt non reprehenderit incididunt dolore in do
                tempor excepteur. Occaecat velit aute ea officia veniam
                incididunt nisi eu culpa irure ullamco aliquip esse culpa.
                Excepteur fugiat enim eu sint adipisicing sint eu consectetur
                duis. Minim culpa exercitation pariatur consequat magna ad sint
                ex consectetur esse elit dolore exercitation. Exercitation
                aliqua voluptate adipisicing id. Voluptate adipisicing duis
                irure in est et aliqua Lorem deserunt anim. Excepteur sit
                commodo labore deserunt ut excepteur ut in commodo. Non dolore
                enim tempor sit id culpa ut est id dolore veniam pariatur cillum
                nisi enim. Deserunt excepteur dolore nulla elit aute quis ad.
                Sunt fugiat reprehenderit exercitation in exercitation anim
                sint. Aliquip pariatur ipsum irure duis eu. Irure in qui
                consequat ipsum. Esse qui dolor dolor. Laboris est aliquip culpa
                officia aliquip esse quis adipisicing ex qui consequat.
                Excepteur consectetur quis aliquip tempor culpa duis mollit
                eiusmod ea consequat. Pariatur voluptate ea mollit eiusmod
                commodo eiusmod. Adipisicing consectetur cillum irure ut.
                Proident dolor reprehenderit ex consectetur esse reprehenderit
                non Lorem irure elit ex in. Pariatur amet tempor ullamco enim
                ullamco labore sunt duis culpa velit aliquip. Excepteur aute
                reprehenderit culpa esse est elit tempor minim in aute nostrud
                cillum aute labore. Nostrud eiusmod commodo mollit laborum nisi
                aliqua laboris aute eu do sunt. Qui mollit laborum ex
                exercitation exercitation tempor veniam elit. Aliqua id ea
                reprehenderit est proident aliquip consequat duis aliqua dolor
                nostrud Lorem pariatur enim cillum. Cillum proident ex id
                cupidatat anim veniam laborum. Labore officia commodo
                exercitation officia in sit adipisicing dolor tempor officia
                dolore. Laboris irure aliqua ut minim est elit. Tempor nisi
                velit in labore esse reprehenderit consectetur Lorem proident ad
                duis Lorem proident. Tempor occaecat voluptate anim duis ut id.
                Mollit elit voluptate commodo elit veniam reprehenderit eiusmod
                nisi aliquip. Minim elit Lorem laborum esse labore id id ut
                exercitation et. Aliqua eiusmod sint id enim sint. Elit commodo
                eu esse est elit proident sunt aute sunt quis veniam aute
                aliquip. Veniam officia sunt commodo ipsum dolor esse quis
                laboris fugiat in nisi non proident reprehenderit voluptate. Ex
                voluptate cillum fugiat est dolor magna elit ex. Fugiat ipsum
                sunt sit ullamco nisi. Exercitation sit occaecat veniam laborum
                aliquip cillum velit irure in aliqua duis irure non ipsum anim.
                Ex laborum nisi exercitation qui velit consectetur. Proident sit
                sint sit eu mollit id laborum. Et consectetur ex nulla aliqua
                velit. Exercitation incididunt reprehenderit sunt. Et cupidatat
                mollit proident velit sint aute esse do culpa reprehenderit
                ullamco dolor veniam excepteur. Mollit duis Lorem qui ut fugiat
                proident ut nostrud aliquip cupidatat ex. Mollit aliqua nostrud
                sunt incididunt amet ipsum proident est sit enim commodo
                pariatur elit dolore. Irure enim consequat esse consectetur
                mollit minim officia. Et occaecat commodo minim laboris culpa
                sit laboris occaecat. Labore culpa id aliqua qui adipisicing
                excepteur cillum sint dolor do laborum cupidatat. Non culpa
                nostrud excepteur duis Lorem consequat eu Lorem mollit ea veniam
                quis nulla amet culpa. Est dolore non dolor dolor nisi occaecat
                mollit sint. Consectetur nisi quis ut voluptate sunt anim culpa
                adipisicing officia dolor elit qui labore irure. Non aute
                nostrud ipsum. Laboris culpa occaecat aute ex exercitation eu.
                Lorem laborum labore dolore. Anim et sint occaecat ad
                consectetur sint commodo elit laboris culpa nisi. Ipsum est
                ipsum adipisicing aute officia esse occaecat ut eiusmod ipsum
                laborum voluptate reprehenderit. Duis ad exercitation in. Aliqua
                labore consequat cupidatat ea. Magna irure aute ipsum commodo
                officia eu est culpa cillum adipisicing non aute dolore ipsum
                aliqua. Magna do occaecat velit quis consequat officia quis
                velit duis ut cillum cillum enim. Culpa eu sunt dolore ad
                exercitation cillum duis occaecat proident culpa qui ipsum est
                pariatur dolore. Magna dolore eu irure. Aliquip mollit duis
                commodo veniam deserunt labore. Aliquip anim labore id commodo
                minim ea proident voluptate qui laborum. Minim est elit amet
                amet et laboris. Consequat id veniam ex cillum quis aliqua culpa
                enim est aliquip tempor id irure incididunt velit. Consectetur
                et sit elit irure culpa irure dolor nulla dolor velit esse
                consectetur. Lorem elit ex consequat proident adipisicing
                exercitation officia est. Nisi nisi labore non deserunt ad
                pariatur elit. Aliquip labore reprehenderit sint sunt aliqua
                amet ex magna magna sit nulla elit. Qui laborum ea duis nostrud
                excepteur adipisicing est laborum consequat non. Occaecat aute
                proident nostrud qui commodo magna. Labore laborum tempor
                proident quis proident officia ad id quis quis elit non ea minim
                consectetur. Ad culpa pariatur laborum culpa ea. Aute cupidatat
                commodo nulla mollit tempor in excepteur eu ad aliquip est
                aliqua voluptate proident aliqua. Quis fugiat officia sint
                voluptate aliquip non occaecat laboris. Aute ipsum nostrud
                aliquip dolore amet irure dolor exercitation sint sit eu
                deserunt reprehenderit deserunt. Amet nulla ut excepteur eiusmod
                veniam fugiat velit duis incididunt veniam cillum. Duis officia
                fugiat deserunt sit amet aliqua reprehenderit occaecat anim quis
                laboris voluptate fugiat fugiat. Elit sunt in consequat sunt
                enim voluptate qui. Ullamco occaecat irure amet occaecat anim
                irure laborum quis pariatur veniam nostrud et ad. Ut consectetur
                amet excepteur reprehenderit qui reprehenderit laboris id ex
                occaecat ullamco officia. Occaecat et consectetur ex consequat.
                Excepteur eu consequat pariatur. Et aute exercitation elit.
                Ullamco cupidatat irure sunt ad. Reprehenderit minim
                exercitation in et in proident tempor nostrud adipisicing. Lorem
                consequat minim ullamco duis elit nulla dolor ipsum excepteur
                sint eiusmod in sint magna do. Non pariatur culpa ipsum veniam
                consequat. Ad ut esse eiusmod voluptate quis exercitation
                commodo aute cillum laboris laborum proident voluptate. Lorem
                est sint ea Lorem aliqua. Ex consectetur cupidatat est. Fugiat
                magna et reprehenderit consequat mollit aliqua velit cupidatat
                ipsum exercitation dolor. Laboris culpa ullamco reprehenderit
                deserunt irure aute mollit eiusmod est id. Ut eu aute ad in
                laboris. Aute esse minim adipisicing ut. Adipisicing est anim
                nisi ullamco ipsum minim voluptate amet do eiusmod consequat.
                Consectetur labore Lorem fugiat dolore aliqua esse sit proident
                sint dolore laborum. Irure fugiat do eiusmod commodo ea occaecat
                dolore. Cupidatat irure eu sit elit cillum proident dolore
                laboris Lorem sunt dolore irure elit adipisicing officia. Sit
                nisi consectetur ut commodo minim est culpa minim. Ut consequat
                quis voluptate labore proident exercitation magna sunt anim.
                Laborum adipisicing culpa mollit esse ea anim Lorem.
                Reprehenderit enim est veniam labore nisi eiusmod non velit
                ullamco ea do adipisicing. Excepteur commodo ut consectetur ea
                esse dolor in veniam cillum. Esse reprehenderit deserunt Lorem
                magna aute. Non occaecat eu aliqua ut amet veniam exercitation.
                Commodo aliquip aute adipisicing nostrud in culpa amet
                exercitation veniam non fugiat tempor sint exercitation. Ex
                aliquip irure aute ullamco commodo ex voluptate elit amet
                voluptate excepteur consequat enim cupidatat. Ipsum sint
                voluptate labore aliquip aliqua aute dolore labore dolor
                pariatur cillum. Ut do exercitation occaecat esse ullamco non
                fugiat officia. Deserunt mollit cillum do id id ea excepteur
                magna nisi ipsum cillum laboris eu. Duis sit anim aliquip enim.
                Officia nulla labore consequat labore occaecat cillum quis amet
                consequat anim enim nulla officia tempor. Sunt deserunt et
                veniam adipisicing excepteur elit. Adipisicing veniam
                adipisicing velit fugiat enim reprehenderit labore nulla. Culpa
                ex est anim non reprehenderit laborum ullamco ea occaecat aliqua
                laboris aliqua. Nisi veniam dolore et in. Deserunt eu labore
                sunt voluptate. Labore est dolore ex Lorem. Proident pariatur in
                ut. Culpa incididunt proident velit proident incididunt nostrud
                in in et consectetur est consequat enim ad deserunt. Veniam aute
                nostrud et ea reprehenderit cupidatat mollit ex exercitation ea
                et duis qui quis. Culpa ex cupidatat enim veniam cillum. In
                cupidatat deserunt tempor proident ad do laboris magna dolor ad
                sint ullamco. Irure incididunt officia voluptate in cupidatat
                amet quis laboris. Irure quis amet pariatur laboris exercitation
                amet nostrud. Et aliquip ullamco officia consectetur ipsum qui
                quis aute duis irure ex. Officia Lorem do exercitation anim.
                Excepteur laboris sint dolor consectetur. Non consectetur
                consequat occaecat reprehenderit ad enim et minim eiusmod
                pariatur cupidatat sit eu officia fugiat. Minim veniam do
                laborum laborum laboris enim ad. Esse pariatur nisi esse
                adipisicing aliquip aute ad commodo velit in. Tempor esse Lorem
                tempor aliquip ullamco commodo proident proident non nisi. Dolor
                occaecat dolor eu in cupidatat culpa deserunt dolor. Adipisicing
                quis fugiat occaecat officia esse ex velit sint laboris do
                tempor. Commodo deserunt quis non est elit aute ex qui.
                Reprehenderit nostrud deserunt do proident id id sint
                consectetur exercitation. Elit reprehenderit labore mollit
                deserunt magna esse ea id cillum. Quis nostrud reprehenderit
                magna quis qui reprehenderit nostrud incididunt labore proident
                consectetur. Exercitation id nulla irure labore. Quis velit
                dolore aliqua eu proident incididunt voluptate culpa aliqua
                ipsum eiusmod. Consectetur do in minim eu aliquip voluptate
                cillum sint ad labore commodo. Voluptate in consectetur nulla ad
                est proident minim tempor labore proident nulla. Ut irure sint
                reprehenderit. Veniam aute est consectetur. Id nulla incididunt
                velit proident ea duis anim ea cillum. Veniam qui aliqua dolor
                mollit laboris eiusmod culpa sunt reprehenderit consequat
                fugiat. Qui minim eiusmod culpa do dolor ex sunt deserunt. Enim
                aute laborum laboris. Ipsum magna sint veniam sunt anim nulla in
                et occaecat amet sunt. Ad ad adipisicing irure magna. Quis nisi
                cupidatat excepteur nostrud incididunt amet consequat quis aute
                ipsum qui dolore. Adipisicing minim velit laboris nulla sint
                magna reprehenderit dolor amet quis tempor id. Incididunt amet
                magna ad quis consectetur veniam. Esse amet quis deserunt
                aliquip voluptate sint cillum dolore ullamco. Sit esse culpa
                consectetur ut veniam officia reprehenderit velit culpa nostrud
                commodo cillum tempor dolore laborum. Mollit sunt commodo dolor
                est magna. Officia enim et aliqua Lorem id ex sint sint non qui
                laboris velit excepteur eu. Voluptate dolor excepteur tempor
                cupidatat enim reprehenderit. Irure ut ut tempor ad aliquip
                deserunt sunt ut. Lorem officia fugiat nulla laborum est duis
                nostrud labore sunt aliqua mollit id cillum. Elit pariatur quis
                reprehenderit sit nulla nostrud esse veniam ad. Ullamco qui
                adipisicing ad id anim ullamco aliqua aliqua anim velit. Tempor
                aliquip occaecat consequat. Tempor tempor ullamco ullamco sint
                exercitation dolor proident laborum. Consectetur elit nostrud
                nisi reprehenderit eu proident. Magna quis tempor do. Tempor
                proident et irure amet nisi. Anim cupidatat voluptate cillum
                consequat veniam nostrud veniam dolor do laborum aliquip culpa
                proident. Exercitation minim reprehenderit irure quis
                consectetur labore voluptate enim. Culpa ex magna ut excepteur
                nisi ipsum in irure magna non excepteur eu. Non irure esse
                mollit culpa Lorem sit mollit sunt veniam ea nisi non proident.
                Fugiat velit non laboris magna exercitation non nulla dolore
                nisi ex incididunt culpa commodo ad. Ipsum mollit ullamco Lorem
                officia nulla. Voluptate laborum veniam in. Reprehenderit
                occaecat commodo pariatur occaecat amet sunt et ut veniam
                laborum do. Est nulla est fugiat laborum mollit sint aute
                voluptate reprehenderit. Consectetur consequat laborum Lorem
                cupidatat. Tempor ipsum nostrud velit elit. Aliqua laborum culpa
                nostrud commodo qui sint tempor eu culpa nostrud ex officia
                proident laboris. Fugiat sint aute mollit. Fugiat sint qui ea
                sunt pariatur elit do. Incididunt pariatur nulla elit tempor
                reprehenderit adipisicing. Aute et velit do magna id amet esse
                eiusmod tempor elit laboris nulla Lorem incididunt. Irure
                reprehenderit ut enim sunt magna cupidatat dolore laborum esse
                esse est incididunt duis velit. Pariatur sint incididunt duis.
                Quis aliqua culpa exercitation consectetur est duis eu sint
                aute. Lorem Lorem exercitation reprehenderit reprehenderit
                veniam veniam nostrud anim enim pariatur Lorem. Adipisicing
                laboris aliquip dolore adipisicing duis qui cillum aliquip
                commodo consequat consectetur officia do. Quis consequat nisi ea
                pariatur qui duis fugiat nostrud aliqua occaecat nisi. Ex eu
                minim laboris officia cupidatat nostrud aute elit aliqua
                deserunt voluptate. Veniam excepteur nulla tempor reprehenderit
                quis do adipisicing exercitation enim pariatur mollit
                reprehenderit mollit. Occaecat cillum proident laboris do fugiat
                cupidatat dolor excepteur proident occaecat fugiat eiusmod culpa
                voluptate consectetur. Cillum magna pariatur sit ut consequat
                magna occaecat velit dolore proident sunt cillum ea incididunt.
                Do esse do enim sint tempor proident sint laborum sunt. Amet
                ipsum ad eiusmod proident. Mollit do laborum enim pariatur dolor
                pariatur mollit quis. Lorem mollit id labore ea qui labore ipsum
                elit amet. Deserunt incididunt adipisicing adipisicing non
                minim. Ipsum nulla tempor elit labore dolore. Et Lorem aute
                minim do cillum non reprehenderit amet ullamco anim sit ipsum
                quis do do. Nostrud aliquip velit veniam magna qui. Dolor irure
                fugiat fugiat aliquip. Velit nisi commodo Lorem. Enim dolor ex
                aute veniam ullamco ad aliquip fugiat. Incididunt enim do cillum
                aliqua consectetur tempor nulla cillum. Mollit consequat labore
                et deserunt sit aute nisi nulla proident ut. Mollit consequat
                consequat ea sit sint non officia. Eu Lorem deserunt aliqua anim
                esse ullamco ea dolore ex fugiat adipisicing dolore aliqua Lorem
                elit. Aute quis ad velit ea esse qui proident aliqua cupidatat
                do. Eu officia ad consequat quis dolor ea tempor laborum eu
                irure duis minim incididunt. Nostrud do eu sint exercitation
                reprehenderit. Ut sint officia excepteur quis ipsum amet enim
                Lorem ipsum velit magna irure eu sint. In dolore voluptate
                exercitation laboris est. Voluptate incididunt enim labore
                incididunt. Id est aute in qui enim amet magna consectetur qui
                non proident veniam id fugiat officia. Occaecat et laborum sint
                est irure occaecat fugiat. Non dolore id fugiat incididunt. Esse
                tempor labore dolore mollit velit aliquip.
            </div>
            <div className="flex-1 bg-amber-50"></div>

            {/* Bottom add new task */}
            <div className="bg-black flex sticky bottom-0 z-10">
                <input
                    onChange={handleChange}
                    value={addNewTaskInputValue}
                    placeholder="Add new"
                    className="h-16 text-white flex-1 text-wrap px-4 text-lg focus:outline-none focus:ring-0"
                />
                <button
                    onClick={addTask}
                    className="w-16 h-16 cursor-pointer hover:bg-blue-500 duration-100 flex items-center justify-center "
                >
                    <span className="material-icons text-white">add</span>
                </button>
            </div>
        </div>
    );
}

export default TodoSection;
