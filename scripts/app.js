"use strict";
(function () {
    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.Serialize()) {
            let key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.Serialize());
        }
    }
    function DisplayHomePage() {
        console.log("display home Page called!");
        $("#AboutUs").on("click", () => {
            LoadLink("about");
        });
        $("main").append(`<p id="mainParagraph" class="mt-3">This is the main paragraph</p>`);
        $("main").append(`<article ">
        <p id="articleParagraph" class="mt-3">This is the article paragraph</p>
        </article>`);
    }
    function DisplayProductsPage() {
    }
    function DisplayServicesPage() {
    }
    function DisplayAboutUsPage() {
    }
    function ValidateField(input_field_id, regular_expression, error_message) {
        let messageArea = $("#messageArea").hide();
        $(input_field_id).on("blur", function () {
            let inputFieldText = $(this).val();
            if (!regular_expression.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }
    function ContactFormValidation() {
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-Z][a-z]+))*$/, "Please enter a valid first Name and lastName");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter a valid phone contact number.");
        ValidateField("#emailAddress", /^[a-zA-z0-9._-]+@[a-zA-z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid email address");
    }
    function DisplayContactPage() {
        console.log("Contact Us Page");
        $("a[data='contactlist']").off("click");
        $("a[data='contactlist']").on("click", function () {
            LoadLink("contactlist");
        });
        ContactFormValidation();
        $("#sendButton").on("click", () => {
            if ($("#suscribecheckbox").is("checked")) {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }
    function DisplayContactlistPage() {
        console.log("contact list page");
        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = " ";
            let keys = Object.keys(localStorage);
            let index = 1;
            for (const key of keys) {
                let contactData = localStorage.getItem(key);
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
                        </tr>`;
                index++;
            }
            contactList.innerHTML = data;
            $("#addButton").on("click", () => {
                LoadLink("edit", "add");
            });
            $("button.delete").on("click", function () {
                if (confirm("are you sure you want ot delete contact")) {
                    localStorage.removeItem($(this).val());
                }
                LoadLink("contactlist");
            });
            $("Button.edit").on("click", function () {
                LoadLink("edit", $(this).val());
            });
        }
    }
    function DisplayEditPage() {
        console.log("Edit Contact Page");
        let page = router.LinkData;
        switch (page) {
            case "add":
                ContactFormValidation();
                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fas fa-plus-circle  fa-sm"></i> Add`);
                $("#editButton").on("click", (event) => {
                    event.preventDefault();
                    let fullName = document.forms[0].fullName.value;
                    let contactNumber = document.forms[0].contactNumber.value;
                    let emailAddress = document.forms[0].emailAddress.value;
                    AddContact(fullName, contactNumber, emailAddress);
                    LoadLink("contactlist");
                });
                $("#cancelButton").on("click", () => {
                    LoadLink("contactlist");
                });
                break;
            default:
                {
                    ContactFormValidation();
                    let contact = new core.Contact();
                    contact.Deserialize(localStorage.getItem(page));
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);
                    $("#editButton").on("click", (event) => {
                        event.preventDefault();
                        contact.FullName = $("#fullName").val();
                        contact.ContactNumber = $("#contactNumber").val();
                        contact.EmailAddress = $("#emailAddress").val();
                        localStorage.setItem(page, contact.Serialize());
                        LoadLink("contactlist");
                    });
                    $("#cancelButton").on("click", () => {
                        LoadLink("contactlist");
                    });
                }
                break;
        }
    }
    function DisplayLoginPage() {
        console.log("login page!");
        let messageArea = $("#messageArea");
        messageArea.hide();
        AddlinkEvents("register");
        $("#loginButton").on("click", function () {
            let success = false;
            let newUser = new core.User();
            $.get("./data/user.json", function (data) {
                for (const U of data.users) {
                    let username = document.forms[0].username.value;
                    let password = document.forms[0].password.value;
                    if (username === U.Username && password === U.Password) {
                        console.log("success");
                        newUser.fromJSON(U);
                        success = true;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.Serialize());
                    messageArea.removeAttr("class").hide();
                    LoadLink("contactlist");
                }
                else {
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("error: failed" +
                        "to authenticate, please check your credentials");
                }
            });
        });
        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            LoadLink("home");
        });
    }
    function Authgaurd() {
        let protected_routes = ["contactlist"];
        if (protected_routes.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                router.ActiveLink = "login";
            }
        }
    }
    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            $("#Login").html(`<a  class ="nav-link" data="login">
                    <i class ="fa-solid fa-sign-out-alt"></i> Login</a>`);
        }
        $("#logout").on("click", function () {
            sessionStorage.clear();
            LoadLink("home");
        });
        AddNavigationEvents();
    }
    function DisplayRegisterPage() {
        console.log("Register page!");
        AddlinkEvents("login");
        let errorMessage = $("#messageArea").hide();
        let nameRegEx = /^[A-Za-z]{2,}$/;
        let passRegEx = /^.{6,}$/;
        $("#firstName").on("blur", function () {
            let firstName = $(this).val();
            if (!nameRegEx.test(firstName)) {
                $(this).trigger("focus").trigger("select");
                errorMessage.addClass("alert alert-danger").text("Invalid first Name").show();
            }
            else {
                errorMessage.removeAttr("class").hide();
            }
        });
        $("#lastName").on("blur", function () {
            let lastName = $(this).val();
            if (!nameRegEx.test(lastName)) {
                $(this).trigger("focus").trigger("select");
                errorMessage.addClass("alert alert-danger").text("Invalid last Name").show();
            }
            else {
                errorMessage.removeAttr("class").hide();
            }
        });
        $("#emailAddress").on("blur", function () {
            let emailAddress = $(this).val();
            let emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegEx.test(emailAddress)) {
                $(this).trigger("focus").trigger("select");
                errorMessage.addClass("alert alert-danger").text("Invalid Email Address").show();
            }
            else {
                errorMessage.removeAttr("class").hide();
            }
        });
        $("#password, #confirmPassword").on("blur", function () {
            let password = $("#password").val();
            let confirmPassword = $("#confirmPassword").val();
            if (password !== confirmPassword && !passRegEx.test(password)) {
                $("#submitButton").prop('disabled', true);
                errorMessage.addClass("alert alert-danger").text("Invalid password").show();
            }
            else {
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
            let user = new core.User(firstName, lastName.value, username.value, emailAddress.value);
        });
    }
    function ActiveLinkCallBack() {
        let activeLink = router.ActiveLink;
        switch (activeLink) {
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
    function Display404Page() {
        console.log("Displaying 404 Page");
    }
    function capitalizeFirstLetter(page_name) {
        return page_name.charAt(0).toUpperCase() + page_name.slice(1).toLowerCase();
    }
    function LoadLink(link, data = "") {
        router.ActiveLink = link;
        Authgaurd();
        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);
        document.title = capitalizeFirstLetter(router.ActiveLink);
        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });
        $(`li>a:contains(${document.title})`).addClass("active");
        LoadContent();
    }
    function AddNavigationEvents() {
        let navLinks = $("ul>li>a");
        navLinks.off("click");
        navLinks.off("mouseover");
        navLinks.on("click", function () {
            LoadLink($(this).attr("data"));
        });
        navLinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function AddlinkEvents(link) {
        let linkQuery = $(`a.link[data=${link}]`);
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");
        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");
        linkQuery.on("click", function () {
            LoadLink(`${link}`);
        });
        linkQuery.on("mouseover", function () {
            $(this).css("cursor", "pointer");
            $(this).css("font-weight", "bold");
        });
        linkQuery.on("mouseout", function () {
            $(this).css("font-weight", "normal");
        });
    }
    function LoadHeader() {
        $.get("/views/components/header.html", function (html_data) {
            $("header").html(html_data);
            AddNavigationEvents();
            CheckLogin();
        });
    }
    function LoadContent() {
        let page_name = router.ActiveLink;
        $.get(`./views/content/${page_name}.html`, function (html_data) {
            $("main").html(html_data);
            CheckLogin();
            ActiveLinkCallBack();
        });
    }
    function LoadFooter() {
        $.get("/views/components/footer.html", function (html_data) {
            $("footer").html(html_data);
        });
    }
    function Start() {
        console.log("App Started!");
        LoadHeader();
        LoadLink("home");
        LoadFooter();
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map