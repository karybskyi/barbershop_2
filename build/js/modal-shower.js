var link = document.querySelector('.user-list__login');
///user-list__login

var popup = document.querySelector('.modal--login');

var close = document.querySelector('.modal__close');

var login = popup.querySelector('[name=login]');
var password = popup.querySelector('[name=password]');

var form = popup.querySelector('form');

var isStorageSupport = true;
var storage = '';

try
    {
        storage = localStorage.getItem('login');
    }
catch (err)
    {
        isStorageSupport = false;
    }

link.addEventListener('click', function(evt){
    evt.preventDefault();
    popup.classList.remove('modal--hidden');
    popup.classList.add('modal--shown');

    if (storage)
        {
            login.value = storage;
            password.focus();
        }
    else
        {
            login.focus();
        }
});

close.addEventListener('click', function(evt){
    evt.preventDefault();
    popup.classList.remove('modal--shown');
    popup.classList.remove('modal--error');//!!to describe in modal-login.less
    // popup.classList.remove('modal--hidden');
});

window.addEventListener('keydown', function(evt)
{
    if(evt.keyCode===27)
        {
            evt.preventDefault();
            if(popup.classList.contains('modal--shown'))
                {
                    popup.classList.remove('modal--shown');
                    popup.classList.remove('modal--error');
                }
        }
});

form.addEventListener('submit', function(evt)
    {
        if(!login.value||!password.value)
            {
                evt.preventDefault();
                popup.classList.remove('modal--error');
                popup.offsetWidth = popup.offsetWidth;
                popup.classList.add('modal--error');
            }
        else
            {
                if(isStorageSupport)
                        {
                            localStorage.setItem('login',login.value);
                        }
            }
    });

