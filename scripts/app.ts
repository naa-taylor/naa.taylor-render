
(function(){

    /**
     * instatiate and contact to local storage
     * @param {string}fullName
     * @param {string}contactNumber
     * @param {string}emailAddress
     */
     function AddContact(fullName: string, contactNumber: string, emailAddress :string): void{
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.Serialize()) {
            let key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.Serialize() as  string);
        }
    }
    function DisplayHomePage(): void {
        console.log("display home Page called!");

        $("#AboutUs").on("click", () => {
            LoadLink("about");
        });
        //add text to the main tag using JQuery
        $("main").append(`<p id="mainParagraph" class="mt-3">This is the main paragraph</p>`)

        $("main").append(`<article ">
        <p id="articleParagraph" class="mt-3">This is the article paragraph</p>
        </article>`)


    }

        function DisplayProductsPage(): void {

        }

        function DisplayServicesPage() {

        }

        function DisplayAboutUsPage(): void {

        }

    /**
     *
     * @param {string}input_field_id
     * @param {RegExp}regular_expression
     * @param {string}error_message
     */
    function ValidateField(input_field_id: string, regular_expression: RegExp, error_message: string): void{

        //Retrieve message area (id= "messageArea") –using Jquery
        let messageArea= $("#messageArea").hide();

        $(input_field_id).on("blur", function (){
            let inputFieldText = $(this).val() as string;
            if(!regular_expression.test(inputFieldText)){
                //fails validation
                $(this).trigger("focus").trigger("select")
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }else{
                //passes Validation
                messageArea.removeAttr("class").hide();
            }
        });

    }
    function ContactFormValidation(): void
    {
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-Z][a-z]+))*$/,
            "Please enter a valid first Name and lastName");

        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
            "Please enter a valid phone contact number.");

        ValidateField("#emailAddress", /^[a-zA-z0-9._-]+@[a-zA-z0-9._-]+\.[a-zA-Z]{2,10}$/,
            "Please enter a valid email address");

    }

        function DisplayContactPage(): void {

            console.log("Contact Us Page")

            $("a[data='contactlist']").off("click");

            $("a[data='contactlist']").on("click", function (){
                LoadLink("contactlist")
            })


            //call function for each field validation
            ContactFormValidation();
            $("#sendButton").on("click", () => {

                if ($("#suscribecheckbox").is("checked")) {

                    let fullName = document.forms[0].fullName.value;
                    let contactNumber = document.forms[0].contactNumber.value;
                    let emailAddress = document.forms[0].emailAddress.value;


                   AddContact(fullName, contactNumber, emailAddress);
                    // if (contact.Serialize()) {
                    //     let key = contact.FullName.substring(0, 1) + Date.now();
                    //     localStorage.setItem(key, contact.Serialize() as string);
                    // }
                    //console.log("checkbox checked!")
                }
            });
        }

        function DisplayContactlistPage(): void {

            console.log("contact list page");

            if (localStorage.length > 0) {
                let contactList = document.getElementById("contactList") as HTMLElement;
                let data = " ";

                let keys = Object.keys(localStorage);

                let index = 1;
                for (const key of keys) {
                    let contactData = localStorage.getItem(key) as string;
                    let contact = new core.Contact();
                    contact.Deserialize(contactData);

                    data += `<tr><th scope="row" class="text-center">${index}</th>
                        <td>${contact.FullName}</td>
                        <td>${contact.ContactNumber}</td>
                        <td>${contact.EmailAddress}</td>
                        
                        <td class="text-center">
                        <button value="${key}" class="btn btn-primary btn-sm edit">
                        <i class="fas fs-edit fa-sm">Edit</i></button>
                        </td>
                        
                        <td class="text-center">                    
                        <button value="${key}" class="btn btn-danger btn-sm delete">
                        <i class="fas fa-trash-alt fa-sm">delete</i></button></td>
                        </tr>`
                    index++;
                }
                contactList.innerHTML = data;

                $("#addButton").on("click", () => {
                    LoadLink("edit", "add")
                });

                $("button.delete").on("click", function () {
                    // confirm delete
                    if (confirm("are you sure you want ot delete contact")) {
                        localStorage.removeItem($(this).val() as string)
                    }
                    LoadLink("contactlist");
                });

                $("Button.edit").on("click", function () {
                    LoadLink("edit", $(this).val() as string)
                });

            }
        }

        function DisplayEditPage(): void {
            console.log("Edit Contact Page")

            // let page = location.hash.substring(1);
            let page = router.LinkData;
            switch (page) {
                case "add":
                    ContactFormValidation()
                    //using Jquery from the main we override the h1 element and change text
                    $("main>h1").text("Add Contact");
                    //override the edit button to add
                    $("#editButton").html(`<i class="fas fa-plus-circle  fa-sm"></i> Add`)

                    //accept the event (submit) and prevent the submission which is not what we want
                    $("#editButton").on("click", (event) => {
                        event.preventDefault();
                        let fullName = document.forms[0].fullName.value;
                        let contactNumber = document.forms[0].contactNumber.value;
                        let emailAddress = document.forms[0].emailAddress.value;
                        AddContact(fullName, contactNumber, emailAddress);
                        LoadLink("contactlist");
                    });
                    //create an event for cancel btn when clicked
                    $("#cancelButton").on("click", () => {
                        LoadLink("contactlist");
                    })
                    break;
                default: {
                    ContactFormValidation()
                    //edit
                    //get contact information from localStorage
                    let contact = new core.Contact();
                    contact.Deserialize(localStorage.getItem(page) as string);

                    //display the contact info in the edit form
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);

                    //when edit button is pressed - Update the contact
                    $("#editButton").on("click",(event)=>{

                        event.preventDefault();
                        //get changes from Form
                        contact.FullName = $("#fullName").val() as string;
                        contact.ContactNumber = $("#contactNumber").val() as string;
                        contact.EmailAddress = $("#emailAddress").val() as string;

                        //replace the item in local Storage
                        localStorage.setItem(page, contact.Serialize() as string) ;

                        //return to the contact list Page
                        LoadLink("contactlist");
                    });
                    //create an event for cancel button when clicked
                    $("#cancelButton").on("click", () => {
                        LoadLink("contactlist");                    });
                }
                    break;
            }
        }

        function DisplayLoginPage(): void{
            console.log("login page!")

            let messageArea = $("#messageArea")
            messageArea.hide();

            AddlinkEvents("register");

            $("#loginButton").on("click", function(){

                let success = false;
                let newUser = new core.User();

                $.get("./data/user.json", function (data){
                    for (const U of data.users){

                        let username = document.forms[0].username.value;
                        let password = document.forms[0].password.value;

                        if(username === U.Username && password === U.Password){
                            console.log("success")
                            newUser.fromJSON(U);
                            success = true;
                            break;
                        }
                    }
                    if (success){
                        sessionStorage.setItem("user", newUser.Serialize() as string);
                        messageArea.removeAttr("class").hide();
                        LoadLink("contactlist");
                    }else{
                        //fail authentication
                        $("#username").trigger("focus").trigger("select")
                        messageArea.addClass("alert alert-danger").text("error: failed" +
                            "to authenticate, please check your credentials")
                    }
                });
            });
            $("#cancelButton").on("click", function (){

                //reference the form using DOM reference
                document.forms[0].reset();
                LoadLink("home");
            });
        }
        function Authgaurd() :void{
            let protected_routes: string[] = ["contactlist"];

            if(protected_routes.indexOf(router.ActiveLink)> -1){
                if(!sessionStorage.getItem("user")){
                    router.ActiveLink = "login"
                }
            }

        }
        function CheckLogin(): void{
            //check if user is looged in
            if(sessionStorage.getItem("user")){
                $("#Login").html(`<a  class ="nav-link" data="login">
                    <i class ="fa-solid fa-sign-out-alt"></i> Login</a>`)

            }
            $("#logout").on("click", function(){
                sessionStorage.clear();
                LoadLink("home");
            });
            AddNavigationEvents()
        }

        function DisplayRegisterPage(){
            console.log("Register page!")

            AddlinkEvents("login");

            /*
            create a div element with an id of
            “ErrorMessage”. This div element should be hidden when the user first navigates to the
            register.html page. This area will be used to display errors if the user enters invalid data in the
            input fields of the registerForm. When the error clears, this div element should be hidden
            */

            let errorMessage = $("#messageArea").hide();
            //create a regular expression for both last name and first names and password
            let nameRegEx = /^[A-Za-z]{2,}$/;
            let passRegEx = /^.{6,}$/;

            /*
            ensure when the user enters their First Name
            and Last Name that the minimum length  2 characters
             */

                $("#firstName").on("blur", function (){
                    let firstName = $(this).val() as string;

                    if(!nameRegEx.test(firstName)){
                        //fails validation
                        $(this).trigger("focus").trigger("select")
                        errorMessage.addClass("alert alert-danger").text("Invalid first Name").show();
                    }else{
                        //passes Validation
                        errorMessage.removeAttr("class").hide();
                    }
                });

            $("#lastName").on("blur", function (){
                let lastName = $(this).val() as string;

                if(!nameRegEx.test(lastName)){
                    //fails validation
                    $(this).trigger("focus").trigger("select")
                    errorMessage.addClass("alert alert-danger").text("Invalid last Name").show();
                }else{
                    //passes Validation
                    errorMessage.removeAttr("class").hide();
                }
            });

            /*
            when the user enters their email address ensure
            that the minimum length is 8 and that an @ symbol is present
             */
            $("#emailAddress").on("blur", function (){
                let emailAddress = $(this).val() as string;
                let emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!emailRegEx.test(emailAddress)){
                    //fails validation
                    $(this).trigger("focus").trigger("select")
                    errorMessage.addClass("alert alert-danger").text("Invalid Email Address").show();
                }else{
                    //passes Validation
                    errorMessage.removeAttr("class").hide();
                }
            });

            $("#password, #confirmPassword").on("blur", function (){
                let password = $("#password").val() as string;
                let confirmPassword = $ ("#confirmPassword").val();

                if(password !== confirmPassword && !passRegEx.test(password)){
                    $("#submitButton").prop('disabled', true);
                    errorMessage.addClass("alert alert-danger").text("Invalid password").show();
                }else{
                    errorMessage.removeAttr("class").hide();
                    $("#submitButton").prop('disabled', false);
                }
            });

            $("#submitButton").on("click", (event) => {
                event.preventDefault();
                let firstName = document.forms[0].firstName.value;
                let lastName = document.forms[0].lastName.value;
                let username = document.forms[0].username.value;
                let emailAddress = document.forms[0].emailAddress.value;

//revisit
                let user = new core.User(firstName, lastName.value, username.value, emailAddress.value);
            });
        }

    /**
     * Returns a function for active link to display
     * @param {string}activeLink
     * @returns {function}}
     */
        function ActiveLinkCallBack(){
            let activeLink = router.ActiveLink;
            switch(activeLink){
                case "home": return DisplayHomePage();
                case "about": return DisplayAboutUsPage();
                case "services": return DisplayServicesPage();
                case "products": return DisplayProductsPage();
                case "contact": return DisplayContactPage();
                case "contactlist": return DisplayContactlistPage();
                case "edit": return DisplayEditPage();
                case "login": return DisplayLoginPage();
                case "register": return DisplayRegisterPage();
                case "404": return Display404Page();
                default:
                    console.log("error: callback does not exists" + activeLink);
                    break;


            }

        }
        function Display404Page(){
            console.log("Displaying 404 Page");
        }
    function capitalizeFirstLetter(page_name: string): string{
        return page_name.charAt(0).toUpperCase() + page_name.slice(1).toLowerCase();
    }

        function LoadLink(link: string, data: string = ""): void{

            router.ActiveLink = link;

            Authgaurd();

            router.LinkData = data;

            history.pushState({}, "",router.ActiveLink);

            document.title = capitalizeFirstLetter(router.ActiveLink);

            $("ul>li>a").each(function (){
                $(this).removeClass("active");
            })

            $(`li>a:contains(${document.title})`).addClass("active");

            LoadContent();
        }
    function AddNavigationEvents(){
        let navLinks = $("ul>li>a");

        navLinks.off("click");
        navLinks.off("mouseover");

        navLinks.on("click", function (){
            LoadLink($(this).attr("data") as string)


        });
        navLinks.on("mouseover", function (){
            $(this).css("cursor", "pointer")

        });
    }

    function AddlinkEvents(link : string): void{
        let linkQuery = $(`a.link[data=${link}]`);

        linkQuery.off("click")
        linkQuery.off("mouseover")
        linkQuery.off("mouseout")

        linkQuery.css("text-decoration","underline")
        linkQuery.css("color", "blue")

        linkQuery.on("click", function(){
            LoadLink(`${link}`)
        })
        linkQuery.on("mouseover", function(){
            $(this).css("cursor", "pointer")
            $(this).css("font-weight", "bold")
        })
        linkQuery.on("mouseout", function(){
            $(this).css("font-weight", "normal")
        })
    }
    function LoadHeader(): void {

        $.get("/views/components/header.html", function (html_data) {
            $("header").html(html_data);
            AddNavigationEvents();
            CheckLogin();
        });
    }

    function LoadContent(): void{
            let page_name: string = router.ActiveLink;

        $.get(`./views/content/${page_name}.html`, function (html_data){
            $("main").html(html_data);
            CheckLogin();
            ActiveLinkCallBack();

        });
        }
    function LoadFooter(): void{
        $.get("/views/components/footer.html", function (html_data){
            $("footer").html(html_data);

        });
    }


    function Start() {
            console.log("App Started!")
           LoadHeader();

           LoadLink("home");

           LoadFooter();
        }

        window.addEventListener("load", Start)

})()