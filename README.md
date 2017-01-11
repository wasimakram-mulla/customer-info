# customer-info Application

## Steps to run the application.
1. You need to checkout/download the application from git.
2. This application contains angular code and will only run on a local server, there are two ways to avoid this
	a. run the application on Firefox (It has a default disabled security)
	b. search for "disable web security for chrome" on Google and perform the steps. (http://stackoverflow.com/questions/24290149/creating-google-chrome-shortcut-with-disable-web-security)
3. Run the application directly from index.html
4. Kindly wait as the application tries to fetch the data from Online, if in case it does not get the data online it will automatically fetch the same offline.

## Features.
1. The initial data which is shown is only 10 rows per page, if you want you can change the number of rows from options at bottom of the page.
2. You can search the customer details directly from the **Search box** at the top, by default the search is filtered by first name of the customer, you can change the filter criteria from the select box next to search box. The relevant data will be searched according to the options selected.
3. You can sort the content of the data from table headings, currently I have added three sorting columns like (first name, lastname and country), similarly it is very easy to add more columns to sort only a few minor changes in the code can do it.
4. The **Pagination** at the bottom of the page is a custom pagination created with the help of Angular, Created a custom pagination because readymade plug-ins would not have sufficed the need of the application. I have still added the code for a readymade plugin you just need to un-comment some code from index.html and CustController.js (already mentioned in the code).
5. There is also a feature added like "Advance filter", where you can search the data according to the filter you add, **But going ahead with advanced filter will disable the search box at the top**.

If there are any more features that I can add, please fork this git and add Issues, I will surely go ahead and resolve the same.

Thanks :)
##### -- By Wasimakram Mulla