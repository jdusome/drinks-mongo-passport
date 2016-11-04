/**
 * Created by Jungle on 14/10/2016.
 */
/* use JQUERY which we downloaded
find any html element with the class "confirmation"
attach a js confirmation popup to the click event of these html elements
 */

$('.confirmation').on('click', function(){

    return confirm('Are you sure you want to delete this?');

});