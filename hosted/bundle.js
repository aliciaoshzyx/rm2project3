"use strict";

var handleExpense = function handleExpense(e) {
    e.preventDefault();

    $("#message").animate({ width: 'hide' }, 350);

    if ($("#expenseName").val() == '' || $("#expenseAmount").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#expenseForm").attr("action"), $("#expenseForm").serialize(), function () {
        loadExpensessFromServer();
    });
    return false;
};

var ExpenseForm = function ExpenseForm(props) {
    return React.createElement(
        "form",
        { id: "expenseForm",
            onSubmit: handleExpense,
            name: "expenseForm",
            action: "/maker",
            method: "POST",
            className: "expenseForm"
        },
        React.createElement(
            "label",
            { htmlFor: "expenseName" },
            "Expense: "
        ),
        React.createElement("input", { id: "expenseName", type: "text", name: "expenseName", placeholder: "McDonalds" }),
        React.createElement(
            "label",
            { htmlFor: "expenseAmount" },
            "Amount Due: "
        ),
        React.createElement("input", { id: "expenseAmount", type: "text", name: "expenseAmount", placeholder: "0.00" }),
        React.createElement(
            "label",
            { htmlFor: "expenseIntensity" },
            "Intensity: "
        ),
        React.createElement(
            "select",
            { id: "expenseIntensity", name: "expenseIntensity" },
            React.createElement(
                "option",
                { selected: true, value: "$" },
                "$"
            ),
            React.createElement(
                "option",
                { value: "$$" },
                "$$"
            ),
            React.createElement(
                "option",
                { value: "$$$" },
                "$$$"
            ),
            React.createElement(
                "option",
                { value: "$$$$" },
                "$$$$"
            ),
            React.createElement(
                "option",
                { value: "$$$$$" },
                "$$$$$"
            )
        ),
        React.createElement(
            "label",
            { htmlFor: "expenseDay" },
            "Day: "
        ),
        React.createElement(
            "select",
            { id: "expenseDay", name: "expenseDay" },
            React.createElement(
                "option",
                { value: "1" },
                "1"
            ),
            React.createElement(
                "option",
                { value: "2" },
                "2"
            ),
            React.createElement(
                "option",
                { value: "3" },
                "3"
            ),
            React.createElement(
                "option",
                { value: "4" },
                "4"
            ),
            React.createElement(
                "option",
                { value: "5" },
                "5"
            ),
            React.createElement(
                "option",
                { value: "6" },
                "6"
            ),
            React.createElement(
                "option",
                { value: "7" },
                "7"
            ),
            React.createElement(
                "option",
                { value: "8" },
                "8"
            ),
            React.createElement(
                "option",
                { value: "9" },
                "9"
            ),
            React.createElement(
                "option",
                { value: "10" },
                "10"
            ),
            React.createElement(
                "option",
                { value: "11" },
                "11"
            ),
            React.createElement(
                "option",
                { value: "12" },
                "12"
            ),
            React.createElement(
                "option",
                { value: "13" },
                "13"
            ),
            React.createElement(
                "option",
                { value: "14" },
                "14"
            ),
            React.createElement(
                "option",
                { value: "15" },
                "15"
            ),
            React.createElement(
                "option",
                { value: "16" },
                "16"
            ),
            React.createElement(
                "option",
                { value: "17" },
                "17"
            ),
            React.createElement(
                "option",
                { value: "18" },
                "18"
            ),
            React.createElement(
                "option",
                { value: "19" },
                "19"
            ),
            React.createElement(
                "option",
                { value: "20" },
                "20"
            ),
            React.createElement(
                "option",
                { value: "21" },
                "21"
            ),
            React.createElement(
                "option",
                { value: "22" },
                "22"
            ),
            React.createElement(
                "option",
                { value: "23" },
                "23"
            ),
            React.createElement(
                "option",
                { value: "24" },
                "24"
            ),
            React.createElement(
                "option",
                { value: "25" },
                "25"
            ),
            React.createElement(
                "option",
                { value: "26" },
                "26"
            ),
            React.createElement(
                "option",
                { value: "27" },
                "27"
            ),
            React.createElement(
                "option",
                { value: "28" },
                "28"
            ),
            React.createElement(
                "option",
                { value: "29" },
                "29"
            ),
            React.createElement(
                "option",
                { value: "30" },
                "30"
            ),
            React.createElement(
                "option",
                { value: "31" },
                "31"
            )
        ),
        React.createElement(
            "label",
            { htmlFor: "expenseMonth" },
            "Month: "
        ),
        React.createElement(
            "select",
            { id: "expenseMonth", name: "expenseMonth" },
            React.createElement(
                "option",
                { value: "1" },
                "January"
            ),
            React.createElement(
                "option",
                { value: "2" },
                "February"
            ),
            React.createElement(
                "option",
                { value: "3" },
                "March"
            ),
            React.createElement(
                "option",
                { value: "4" },
                "April"
            ),
            React.createElement(
                "option",
                { value: "5" },
                "May"
            ),
            React.createElement(
                "option",
                { value: "6" },
                "June"
            ),
            React.createElement(
                "option",
                { value: "7" },
                "July"
            ),
            React.createElement(
                "option",
                { value: "8" },
                "August"
            ),
            React.createElement(
                "option",
                { value: "9" },
                "September"
            ),
            React.createElement(
                "option",
                { value: "10" },
                "October"
            ),
            React.createElement(
                "option",
                { value: "11" },
                "November"
            ),
            React.createElement(
                "option",
                { value: "12" },
                "December"
            )
        ),
        React.createElement(
            "label",
            { htmlFor: "expenseYear" },
            "Year: "
        ),
        React.createElement(
            "select",
            { id: "expenseYear", name: "expenseYear" },
            React.createElement(
                "option",
                { value: "2019" },
                "2019"
            ),
            React.createElement(
                "option",
                { value: "2018" },
                "2018"
            ),
            React.createElement(
                "option",
                { value: "2017" },
                "2017"
            ),
            React.createElement(
                "option",
                { value: "2016" },
                "2016"
            ),
            React.createElement(
                "option",
                { value: "2015" },
                "2015"
            ),
            React.createElement(
                "option",
                { value: "2014" },
                "2014"
            ),
            React.createElement(
                "option",
                { value: "2013" },
                "2013"
            ),
            React.createElement(
                "option",
                { value: "2012" },
                "2012"
            ),
            React.createElement(
                "option",
                { value: "2011" },
                "2011"
            ),
            React.createElement(
                "option",
                { value: "2010" },
                "2010"
            ),
            React.createElement(
                "option",
                { value: "2009" },
                "2009"
            ),
            React.createElement(
                "option",
                { value: "2008" },
                "2008"
            ),
            React.createElement(
                "option",
                { value: "2007" },
                "2007"
            ),
            React.createElement(
                "option",
                { value: "2006" },
                "2006"
            ),
            React.createElement(
                "option",
                { value: "2005" },
                "2005"
            ),
            React.createElement(
                "option",
                { value: "2004" },
                "2004"
            ),
            React.createElement(
                "option",
                { value: "2003" },
                "2003"
            ),
            React.createElement(
                "option",
                { value: "2002" },
                "2002"
            ),
            React.createElement(
                "option",
                { value: "2001" },
                "2001"
            ),
            React.createElement(
                "option",
                { value: "2000" },
                "2000"
            ),
            React.createElement(
                "option",
                { value: "1999" },
                "1999"
            ),
            React.createElement(
                "option",
                { value: "1998" },
                "1998"
            ),
            React.createElement(
                "option",
                { value: "1997" },
                "1997"
            ),
            React.createElement(
                "option",
                { value: "1996" },
                "1996"
            ),
            React.createElement(
                "option",
                { value: "1995" },
                "1995"
            ),
            React.createElement(
                "option",
                { value: "1994" },
                "1994"
            ),
            React.createElement(
                "option",
                { value: "1993" },
                "1993"
            ),
            React.createElement(
                "option",
                { value: "1992" },
                "1992"
            ),
            React.createElement(
                "option",
                { value: "1991" },
                "1991"
            ),
            React.createElement(
                "option",
                { value: "1990" },
                "1990"
            ),
            React.createElement(
                "option",
                { value: "1989" },
                "1989"
            ),
            React.createElement(
                "option",
                { value: "1988" },
                "1988"
            ),
            React.createElement(
                "option",
                { value: "1987" },
                "1987"
            ),
            React.createElement(
                "option",
                { value: "1986" },
                "1986"
            ),
            React.createElement(
                "option",
                { value: "1985" },
                "1985"
            ),
            React.createElement(
                "option",
                { value: "1984" },
                "1984"
            ),
            React.createElement(
                "option",
                { value: "1983" },
                "1983"
            ),
            React.createElement(
                "option",
                { value: "1982" },
                "1982"
            ),
            React.createElement(
                "option",
                { value: "1981" },
                "1981"
            ),
            React.createElement(
                "option",
                { value: "1980" },
                "1980"
            ),
            React.createElement(
                "option",
                { value: "1979" },
                "1979"
            ),
            React.createElement(
                "option",
                { value: "1978" },
                "1978"
            ),
            React.createElement(
                "option",
                { value: "1977" },
                "1977"
            ),
            React.createElement(
                "option",
                { value: "1976" },
                "1976"
            ),
            React.createElement(
                "option",
                { value: "1975" },
                "1975"
            ),
            React.createElement(
                "option",
                { value: "1974" },
                "1974"
            ),
            React.createElement(
                "option",
                { value: "1973" },
                "1973"
            ),
            React.createElement(
                "option",
                { value: "1972" },
                "1972"
            ),
            React.createElement(
                "option",
                { value: "1971" },
                "1971"
            ),
            React.createElement(
                "option",
                { value: "1970" },
                "1970"
            ),
            React.createElement(
                "option",
                { value: "1969" },
                "1969"
            ),
            React.createElement(
                "option",
                { value: "1968" },
                "1968"
            ),
            React.createElement(
                "option",
                { value: "1967" },
                "1967"
            ),
            React.createElement(
                "option",
                { value: "1966" },
                "1966"
            ),
            React.createElement(
                "option",
                { value: "1965" },
                "1965"
            ),
            React.createElement(
                "option",
                { value: "1964" },
                "1964"
            ),
            React.createElement(
                "option",
                { value: "1963" },
                "1963"
            ),
            React.createElement(
                "option",
                { value: "1962" },
                "1962"
            ),
            React.createElement(
                "option",
                { value: "1961" },
                "1961"
            ),
            React.createElement(
                "option",
                { value: "1960" },
                "1960"
            ),
            React.createElement(
                "option",
                { value: "1959" },
                "1959"
            ),
            React.createElement(
                "option",
                { value: "1958" },
                "1958"
            ),
            React.createElement(
                "option",
                { value: "1957" },
                "1957"
            ),
            React.createElement(
                "option",
                { value: "1956" },
                "1956"
            ),
            React.createElement(
                "option",
                { value: "1955" },
                "1955"
            ),
            React.createElement(
                "option",
                { value: "1954" },
                "1954"
            ),
            React.createElement(
                "option",
                { value: "1953" },
                "1953"
            ),
            React.createElement(
                "option",
                { value: "1952" },
                "1952"
            ),
            React.createElement(
                "option",
                { value: "1951" },
                "1951"
            ),
            React.createElement(
                "option",
                { value: "1950" },
                "1950"
            ),
            React.createElement(
                "option",
                { value: "1949" },
                "1949"
            ),
            React.createElement(
                "option",
                { value: "1948" },
                "1948"
            ),
            React.createElement(
                "option",
                { value: "1947" },
                "1947"
            ),
            React.createElement(
                "option",
                { value: "1946" },
                "1946"
            ),
            React.createElement(
                "option",
                { value: "1945" },
                "1945"
            ),
            React.createElement(
                "option",
                { value: "1944" },
                "1944"
            ),
            React.createElement(
                "option",
                { value: "1943" },
                "1943"
            ),
            React.createElement(
                "option",
                { value: "1942" },
                "1942"
            ),
            React.createElement(
                "option",
                { value: "1941" },
                "1941"
            ),
            React.createElement(
                "option",
                { value: "1940" },
                "1940"
            ),
            React.createElement(
                "option",
                { value: "1939" },
                "1939"
            ),
            React.createElement(
                "option",
                { value: "1938" },
                "1938"
            ),
            React.createElement(
                "option",
                { value: "1937" },
                "1937"
            ),
            React.createElement(
                "option",
                { value: "1936" },
                "1936"
            ),
            React.createElement(
                "option",
                { value: "1935" },
                "1935"
            ),
            React.createElement(
                "option",
                { value: "1934" },
                "1934"
            ),
            React.createElement(
                "option",
                { value: "1933" },
                "1933"
            ),
            React.createElement(
                "option",
                { value: "1932" },
                "1932"
            ),
            React.createElement(
                "option",
                { value: "1931" },
                "1931"
            ),
            React.createElement(
                "option",
                { value: "1930" },
                "1930"
            ),
            React.createElement(
                "option",
                { value: "1929" },
                "1929"
            ),
            React.createElement(
                "option",
                { value: "1928" },
                "1928"
            ),
            React.createElement(
                "option",
                { value: "1927" },
                "1927"
            ),
            React.createElement(
                "option",
                { value: "1926" },
                "1926"
            ),
            React.createElement(
                "option",
                { value: "1925" },
                "1925"
            ),
            React.createElement(
                "option",
                { value: "1924" },
                "1924"
            ),
            React.createElement(
                "option",
                { value: "1923" },
                "1923"
            ),
            React.createElement(
                "option",
                { value: "1922" },
                "1922"
            ),
            React.createElement(
                "option",
                { value: "1921" },
                "1921"
            ),
            React.createElement(
                "option",
                { value: "1920" },
                "1920"
            ),
            React.createElement(
                "option",
                { value: "1919" },
                "1919"
            ),
            React.createElement(
                "option",
                { value: "1918" },
                "1918"
            ),
            React.createElement(
                "option",
                { value: "1917" },
                "1917"
            ),
            React.createElement(
                "option",
                { value: "1916" },
                "1916"
            ),
            React.createElement(
                "option",
                { value: "1915" },
                "1915"
            ),
            React.createElement(
                "option",
                { value: "1914" },
                "1914"
            ),
            React.createElement(
                "option",
                { value: "1913" },
                "1913"
            ),
            React.createElement(
                "option",
                { value: "1912" },
                "1912"
            ),
            React.createElement(
                "option",
                { value: "1911" },
                "1911"
            ),
            React.createElement(
                "option",
                { value: "1910" },
                "1910"
            ),
            React.createElement(
                "option",
                { value: "1909" },
                "1909"
            ),
            React.createElement(
                "option",
                { value: "1908" },
                "1908"
            ),
            React.createElement(
                "option",
                { value: "1907" },
                "1907"
            ),
            React.createElement(
                "option",
                { value: "1906" },
                "1906"
            ),
            React.createElement(
                "option",
                { value: "1905" },
                "1905"
            )
        ),
        React.createElement(
            "label",
            { htmlFor: "expenseNotes" },
            "Notes: "
        ),
        React.createElement("input", { id: "expenseNotes", type: "text", name: "expenseNotes", placeholder: "notes" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeExpenseSubmit", type: "submit", value: "Make Expense" })
    );
};

var ExpenseList = function ExpenseList(props) {
    if (props.expenses.length === 0) {
        return React.createElement(
            "div",
            { className: "expenseList" },
            React.createElement(
                "h3",
                { className: "emptyExpense" },
                "No Entries Yet"
            )
        );
    }

    var expenseNodes = props.expenses.map(function (expense) {
        return React.createElement(
            "div",
            { key: expense._id, className: "expense" },
            React.createElement(
                "h3",
                { className: "expenseName" },
                "Name: ",
                expense.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "expenseAmount" },
                "Amount: ",
                expense.amount,
                " "
            )
        );
    });

    return React.createElement(
        "div",
        { className: "expenseList" },
        expenseNodes
    );
};

var loadExpensesFromServer = function loadExpensesFromServer() {
    sendAjax('GET', '/getExpenses', null, function (data) {
        ReactDOM.render(React.createElement(ExpenseList, { expenses: data.expenses }), document.querySelector("#expenses"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(ExpenseForm, { csrf: csrf }), document.querySelector("#makeExpense"));

    ReactDOM.render(React.createElement(ExpenseList, { expenses: [] }), document.querySelector("#expenses"));
    loadExpensesFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#message").text(message);
};

var redirect = function redirect(response) {
    $("#message").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
