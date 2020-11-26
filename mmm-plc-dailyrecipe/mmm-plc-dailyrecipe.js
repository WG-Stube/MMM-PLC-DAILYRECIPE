Module.register("mmm-plc-dailyrecipe",{
    // Default module config.
    defaults: {
        apiBase: 'https://wgstube.1plc.ch/recipe/weekplan/getrecipetoday?authkey=smartmirror',
        menu_lunch: '-',
        menu_lunch_image: '',
        menu_evening: '-',
        menu_evening_image: '',
        animationSpeed: 2000
    },

    processData: function(data) {
        if(data.state == 'success') {
            this.config.menu_lunch = data.menu_lunch;
            this.config.menu_lunch_image = data.menu_lunch_image;
            this.config.menu_evening = data.menu_evening;
            this.config.menu_evening_image = data.menu_evening_image;
            this.loaded = true;
        }

        this.updateDom(self.config.animationSpeed);
    },

    getData: function() {
        var url = this.config.apiBase;
        var self = this;

        Log.log(this.name + ' loading data from oneplace');


        var trainRequest = new XMLHttpRequest();
        trainRequest.open("GET", url, true);
        trainRequest.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    self.processData(JSON.parse(this.response));
                } else if (this.status === 401) {
                    //self.config.station = "";
                    self.updateDom(self.config.animationSpeed);

                    Log.error(self.name + ": Incorrect waht so ever...");
                    retry = false;
                } else {
                    Log.error(self.name + ": Could not load trains.");
                }
            }
        };
        trainRequest.send();
    },

    start: function() {
        this.loaded = false;
        this.getData();
        Log.log(this.name + ' is started!');
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.style.display = 'inline-block';

        if (!this.loaded) {
            wrapper.innerHTML = "Lade Daten aus onePlace ...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        var imageLunch = document.createElement('img');
        imageLunch.src = this.config.menu_lunch_image;
        imageLunch.style.height = 120 + 'px';

        var lunchRow = document.createElement('div');
        lunchRow.style.width = 50+'%';
        lunchRow.style.float = 'left';
        lunchRow.appendChild(imageLunch);
        var lunchText = document.createElement('p');
        lunchText.innerHTML = 'Mittagessen:<br/>'+ this.config.menu_lunch;
        lunchRow.appendChild(lunchText);

        wrapper.appendChild(lunchRow);


        var imageEvening = document.createElement('img');
        imageEvening.src = this.config.menu_evening_image;
        imageEvening.style.height = 120 + 'px';

        var eveningRow = document.createElement('div');
        eveningRow.style.width = 50+'%';
        eveningRow.style.float = 'left';
        eveningRow.appendChild(imageEvening);
        var eveningText = document.createElement('p');
        eveningText.innerHTML = 'Abendessen:<br/>'+ this.config.menu_evening;
        eveningRow.appendChild(eveningText);

        wrapper.appendChild(eveningRow);

        /**

        var imageLunch = document.createElement('img');
        imageLunch.src = this.config.menu_lunch_image;
        imageLunch.width = 200;

        var lunchRow = document.createElement('div');
        lunchRow.width = 50;
        lunchRow.appendChild(image);
        var lunchText = document.createElement('p');
        lunchText.innerHTML = 'Mittagessen: '+ this.config.menu_lunch;
        lunchRow.appendChild(lunchText);

        wrapper.innerHTML = 'Mittag:' + this.config.menu_lunch + ', Abend: '+this.config.menu_evening;
        wrapper.appendChild(lunchRow);

         **/
        //wrapper.innerHTML = 'Mittag:' + this.config.menu_lunch + ', Abend: '+this.config.menu_evening;


        return wrapper;
    }
});