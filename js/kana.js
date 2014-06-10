/**
 * kana.js - Ian Adamson <ian@kana.ninja>
 * 
 * This app provides a flashcard-based approach to learning
 * the Japanese hiragana and katakana syllabaries.
 *
 * This work is licensed under the Creative Commons
 * Attribution-NonCommercial-ShareAlike 3.0 United States
 * License. To view a copy of this license, visit
 * http://creativecommons.org/licenses/by-nc-sa/3.0/us/ or
 * send a letter to Creative Commons, 444 Castro Street,
 * Suite 900, Mountain View, California, 94041, USA.
 */

(function($){
    
    /* App settings and variables */
    // Active modes - pick a random mode from the current active modes for each kana flashcard
    var choose_mode = true;   // Is multiple choice mode enabled?
    var fill_mode = false;    // Is fill-in-the-blank mode enabled?
    var show_mode = false;    // Is show-me-the-answer mode enabled?
    var reverse_mode = false; // Reverse romaji/kana in other modes
    
    // Active sets
    var syllabary = "hiragana";             // hiragana or katakana
    var include_base_set = true;            // Include base set kana?
    var include_diacritics = false;         // Include diacritic kana?
    var include_digraphs = false;           // Include digraph kana?
    var include_diacritic_digraphs = false; // Include the set of diacritic digraph kana?
    
    // Variables
    var current_correct_answer = ""; // The corrrect answer to the current flashcard in romaji
    var current_kana = [];           // Used for "multiple choice" mode--1 correct kana and 2 wrong.
    var current_set = [];            // Active set of flashcards (e.g. hiragana+digraphs+diacritics)

    /* Kana data */
    
	var hiragana = [
        ['a', 'あ'], ['i',  'い'], ['u',  'う'], ['e', 'え'], ['o', 'お'],
        ['ka','か'], ['ki', 'き'], ['ku', 'く'], ['ke','け'], ['ko','こ'],
        ['sa','さ'], ['shi','し'], ['su', 'す'], ['se','せ'], ['so','そ'],
        ['ta','た'], ['chi','ち'], ['tsu','つ'], ['te','て'], ['to','と'],
        ['na','な'], ['ni', 'に'], ['nu', 'ぬ'], ['ne','ね'], ['no','の'],
        ['ha','は'], ['hi', 'ひ'], ['fu', 'ふ'], ['he','へ'], ['ho','ほ'],
        ['ma','ま'], ['mi', 'み'], ['mu', 'む'], ['me','め'], ['mo','も'],
        ['ya','や'], ['yu', 'ゆ'], ['yo', 'よ'], ['ra','ら'], ['ri','り'],
        ['ru','る'], ['re', 'れ'], ['ro', 'ろ'], ['wa','わ'], ['wo','を'],
        ['n', 'ん']
    ];

    var hiragana_diacritics = [
        ['ga','が'], ['gi','ぎ'], ['gu','ぐ'], ['ge','げ'], ['go','ご'],
        ['za','ざ'], ['ji','じ'], ['zu','ず'], ['ze','ぜ'], ['zo','ぞ'],
        ['da','だ'], ['ji','ぢ'], ['zu','づ'], ['de','で'], ['do','ど'],
        ['ba','ば'], ['bi','び'], ['bu','ぶ'], ['be','べ'], ['bo','ぼ'],
        ['pa','ぱ'], ['pi','ぴ'], ['pu','ぷ'], ['pe','ぺ'], ['po','ぽ'], 
        ['vu','ゔ']
    ];
    
    var hiragana_digraphs = [
        ['kya','きゃ'], ['kyu','きゅ'], ['kyo','きょ'],
        ['sha','しゃ'], ['shu','しゅ'], ['sho','しょ'],
        ['cha','ちゃ'], ['chu','ちゅ'], ['cho','ちょ'],
        ['nya','にゃ'], ['nyu','にゅ'], ['nyo','にょ'],
        ['hya','ひゃ'], ['hyu','ひゅ'], ['hyo','ひょ'],
        ['mya','みゃ'], ['myu','みゅ'], ['myo','みょ'],
        ['rya','りゃ'], ['ryu','りゅ'], ['ryo','りょ']
    ];
    
    var hiragana_digraphs_with_diacritics = [
        ['gya','ぎゃ'], ['gyu','ぎゅ'], ['gyo','ぎょ'],
        ['ja', 'じゃ'], ['ju', 'じゅ'], ['jo', 'じょ'],
        ['ja', 'ぢゃ'], ['ju', 'ぢゅ'], ['jo', 'ぢょ'],
        ['bya','びゃ'], ['byu','びゅ'], ['byo','びょ'],
        ['pya','ぴゃ'], ['pyu','ぴゅ'], ['pyo','ぴょ']
    ];
    
    var katakana = [
        ['a',  'ア'], ['i',  'イ'], ['u',  'ウ'], ['e',  'エ'], ['o',  'オ'],
        ['ka', 'カ'], ['ki', 'キ'], ['ku', 'ク'], ['ke', 'ケ'], ['ko', 'コ'],
        ['sa', 'サ'], ['shi','シ'], ['su', 'ス'], ['se', 'セ'], ['so', 'ソ'],
        ['タ', 'ta'], ['chi','チ'], ['tsu','ツ'], ['te', 'テ'], ['to', 'ト'],
        ['na', 'ナ'], ['ni', 'ニ'], ['nu', 'ヌ'], ['ne', 'ネ'], ['no', 'ノ'],
        ['ha', 'ハ'], ['hi', 'ヒ'], ['fu', 'フ'], ['he', 'ヘ'], ['ho', 'ホ'],
        ['ma', 'マ'], ['mi', 'ミ'], ['mu', 'ム'], ['me', 'メ'], ['mo', 'モ'],
        ['ya', 'ヤ'], ['yu', 'ユ'], ['yo', 'ヨ'], ['ra', 'ラ'], ['ri', 'リ'],
        ['ru', 'ル'], ['re', 'レ'], ['ro', 'ロ'], ['wa', 'ワ'], ['wo', 'ヲ']
    ];
    
    var katakana_diacritics = [
        ['ga','ガ'], ['gi','ギ'], ['gu','グ'], ['ge','ゲ'], ['go','ゴ'],
        ['za','ザ'], ['ji','ジ'], ['zu','ズ'], ['ze','ゼ'], ['zo','ゾ'],
        ['da','ダ'], ['ji','ヂ'], ['zu','ヅ'], ['de','デ'], ['do','ド'],
        ['ba','バ'], ['bi','ビ'], ['bu','ブ'], ['be','ベ'], ['bo','ボ'],
        ['pa','パ'], ['pi','ピ'], ['pu','プ'], ['pe','ペ'], ['po','ポ']
    ];
    
    var katakana_digraphs = [
        ['kya','キャ'], ['kyu','キュ'], ['kyo','キョ'],
        ['sha','シャ'], ['shu','シュ'], ['sho','ショ'],
        ['cha','チャ'], ['chu','チュ'], ['cho','チョ'],
        ['nya','ニャ'], ['nyu','ニュ'], ['nyo','ニョ'],
        ['hya','ヒャ'], ['hyu','ヒュ'], ['hyo','ヒョ'],
        ['mya','ミャ'], ['myu','ミュ'], ['myo','ミョ'],
        ['rya','リャ'], ['ryu','リュ'], ['ryo','リョ']
    ];
    
    var katakana_digraphs_with_diacritics = [
        ['gya','ギャ'], ['gyu','ギュ'], ['gyo','ギョ'],
        ['ja', 'ジャ'], ['ju', 'ジュ'], ['jo', 'ジョ'],
        ['ja', 'ヂャ'], ['ju', 'ヂュ'], ['jo', 'ヂョ'],
        ['bya','ビャ'], ['byu','ビュ'], ['byo','ビョ'],
        ['pya','ピャ'], ['pyu','ピュ'], ['pyo','ピョ']
    ];

    /* Functions */
    
    // Thanks to Stephane Roucheray (http://sroucheray.org/blog/)
    Array.prototype.shuffle = function (){
        var i = this.length, j, temp;
        if ( i == 0 ) return;
        while ( --i ) {
            j = Math.floor( Math.random() * ( i + 1 ) );
            temp = this[i];
            this[i] = this[j];
            this[j] = temp;
        }
    };
    
    function getNewKana() {
        // Randomize mode based on active modes
        modes = [];
        if(choose_mode) { modes.push('switchChoose()'); }
        if(fill_mode)   { modes.push('switchFill()'); }
        if(show_mode)   { modes.push('switchShow()'); }        
        eval(modes[Math.floor(Math.random()*modes.length)]);
        
        // Get three random kana
        current_set.shuffle();
        current_kana = current_set.slice(0,3);
        
        // Pick a random one to be the correct answer and display it on the flashcard
        current_correct_answer = current_kana[Math.floor(Math.random()*3)];
        if(reverse_mode) {
            $('div#current-kana').html(current_correct_answer[0]);
            // Set multiple choice answers
            $('#answer-1').html(current_kana[0][1]);        
            $('#answer-2').html(current_kana[1][1]);        
            $('#answer-3').html(current_kana[2][1]);
        } else {
            $('div#current-kana').html(current_correct_answer[1]);
            // Set multiple choice answers
            $('#answer-1').html(current_kana[0][0]);        
            $('#answer-2').html(current_kana[1][0]);        
            $('#answer-3').html(current_kana[2][0]);
        }
        
        // If we're in show answer mode, show the answer.
        if(mode == 'show') {
            if(reverse_mode) {
                $('.answer-message').html('<span>' + current_correct_answer[1] + '</span>'); 
            } else {
                $('.answer-message').html('<span>' + current_correct_answer[0] + '</span>'); 
            }
        }
    }
    
    function disableButtons() {
        $('.answer-button').addClass('btn-disabled');
        $('.settings').addClass('btn-disabled');
    }
    
    function enableButtons() {
        $('.answer-button').removeClass('btn-disabled');
        $('.settings').removeClass('btn-disabled');
    }
    
    function switchFill() {
        mode = 'fill';
        $('.multiple-choice').addClass('hidden');
        $('.fill-in-the-blank').removeClass('hidden');
        $('.show-answer').addClass('hidden');
        $('.current-mode').html('Mode: File in the blank');
        
        $('.answer-message').html('');
    }

    function switchChoose() {
        mode = 'choose';
        $('.multiple-choice').removeClass('hidden');
        $('.fill-in-the-blank').addClass('hidden');
        $('.show-answer').addClass('hidden');
        $('.current-mode').html('Mode: Multiple choice');
        
        $('.answer-message').html('');
    }
    
    function switchShow() {
        mode = 'show';
        $('.multiple-choice').addClass('hidden');
        $('.fill-in-the-blank').addClass('hidden');
        $('.show-answer').removeClass('hidden');
        $('.current-mode').html('Mode: Show answer');
        
        $('.answer-message').html('<span>' + current_correct_answer + '</span>');
    }
    
    function checkAnswer(answer) {
        disableButtons();
        
        var correct_answer;        
        if(reverse_mode) {
            console.log("Correct: " + current_correct_answer[1] + " -- Given: " + answer);
            var correct_answer = current_correct_answer[1];
        } else {
            console.log("Correct: " + current_correct_answer[0] + " -- Given: " + answer);
            var correct_answer = current_correct_answer[0];
        }
        
        
        if(answer == correct_answer) {
            var temp_message = '<div class="alert alert-success">Correct!</div>';
        } else {
            var temp_message = '<div class="alert alert-danger">Incorrect!</div>';
            $( ".answer-button:contains('" + correct_answer + "')" ).prepend('<span class="glyphicon glyphicon-ok pull-right"></span>');
            // Append glyphicon glyphicon-ok span to the correct answer?
        }
        
        $('.answer-message').html(temp_message);
        $(".answer-message").delay(1000).animate(
            { opacity: 0 },
            { complete: function() {
                $(".answer-message").html('');
                $(".answer-message").css('opacity', 1);
                getNewKana();
                $(':focus').blur()
                $(':active').blur()
                enableButtons();
                if(mode == 'fill') {
                    $('.fill-answer').focus().select();
                }
            }},
            700);
        
        $('.fill-answer').val('');
    }
    
    function showSettingsError(m) {
        $('.alert-settings').html(m);
        $(".alert-settings").removeClass('hidden');
        $(".alert-settings").delay(3000).animate(
            { opacity: 0 },
            { complete: function() {
                $(".alert-settings").addClass('hidden');
                $(".alert-settings").css('opacity', 1);
            }},
            1000);
    }
    
    /* Bindings */
    
    $('body').delegate('.answer-button', 'click', function() {
        if(reverse_mode) {
            checkAnswer(current_kana[$(this).data('answer')][1]);
        } else {
            checkAnswer(current_kana[$(this).data('answer')][0]);
        }
    });
    
    $('body').delegate('.fill-answer-button', 'click', function() {
        checkAnswer($('.fill-answer').val());
    });
    
    $('body').delegate('.mode-menu', 'click', function() {
        switch($(this).data('mode')) {
            case 'fill': switchFill(); break;
            case 'choose': switchChoose(); break;
            case 'show': switchShow(); break;
        }
    });
    
    $('body').delegate('.show-next', 'click', function() {
        getNewKana();
    });
    
    $('.fill-answer').bind('keypress', function(e) {
        var code = e.keyCode || e.which;
        if(code == 13) { //Enter keycode
            $('.fill-answer-button').click();
        }
    });
    
    // Show settings
    $('.btn-settings').click(function() {
        // Configure settings styles
        if (syllabary == "hiragana") {
            $('.setting-katakana').addClass('glyphicon-inactive');
            $('.setting-hiragana').removeClass('glyphicon-inactive');
        } else {
            $('.setting-hiragana').addClass('glyphicon-inactive');
            $('.setting-katakana').removeClass('glyphicon-inactive');
        }
        
        if(!include_base_set) {
            $('.setting-base-set').addClass('glyphicon-inactive');
        } else {
            $('.setting-base-set').removeClass('glyphicon-inactive');
        }
        
        if(!include_diacritics) {
            $('.setting-diacritics').addClass('glyphicon-inactive');
        } else {
            $('.setting-diacritics').removeClass('glyphicon-inactive');
        }
        
        if(!include_digraphs) {
            $('.setting-digraphs').addClass('glyphicon-inactive');
        } else {
            $('.setting-digraphs').removeClass('glyphicon-inactive');
        }
        
        if(!include_diacritic_digraphs) {
            $('.setting-digraph-diacritics').addClass('glyphicon-inactive');
        } else {
            $('.setting-digraph-diacritics').removeClass('glyphicon-inactive');
        }
        
        if(!show_mode) {
            $('.setting-show-mode').addClass('glyphicon-inactive');
        } else {
            $('.setting-show-mode').removeClass('glyphicon-inactive');
        }
        
        if(!choose_mode) {
            $('.setting-choose-mode').addClass('glyphicon-inactive');
        } else {
            $('.setting-choose-mode').removeClass('glyphicon-inactive');
        }
        
        if(!fill_mode) {
            $('.setting-fill-mode').addClass('glyphicon-inactive');
        } else {
            $('.setting-fill-mode').removeClass('glyphicon-inactive');
        }
        
        if(!reverse_mode) {
            $('.setting-reverse-mode').addClass('glyphicon-inactive');
        } else {
            $('.setting-reverse-mode').removeClass('glyphicon-inactive');
        }
        
        // Show the settings pane
        $('.app').addClass('hidden');
        $('.settings-menu').removeClass('hidden');
    });
    
    // Hide settings
    $('.btn-close-settings').click(function() {
        if(!(show_mode || choose_mode || fill_mode)) {
            showSettingsError('Must select at least one mode! Reverse mode doesn\'t count.');
        } else if(!(include_base_set || include_diacritic_digraphs || include_diacritics || include_digraphs)) {
            showSettingsError('Must select at least one character set!');
        } else {
            
            // Rebuild active set of kana based on chosen character sets
            current_set = [];
            
            if(syllabary == "katakana") {
                if(include_base_set) {$.merge(current_set, katakana)};
                if(include_diacritics) {$.merge(current_set, katakana_diacritics)};
                if(include_digraphs) {$.merge(current_set, katakana_digraphs)};
                if(include_diacritic_digraphs) {$.merge(current_set, katakana_digraphs_with_diacritics)};
            } else {
                if(include_base_set) {$.merge(current_set, hiragana)};
                if(include_diacritics) {$.merge(current_set, hiragana_diacritics)};
                if(include_digraphs) {$.merge(current_set, hiragana_digraphs)};
                if(include_diacritic_digraphs) {$.merge(current_set, hiragana_digraphs_with_diacritics)};
            }
            
            getNewKana();
            $('.app').removeClass('hidden');
            $('.alert-settings').addClass('hidden');
            $('.settings-menu').addClass('hidden');
        }
    });
    
    // Show glossary
    $('.btn-glossary').click(function() {
        $('.app').addClass('hidden');
        $('.glossary').removeClass('hidden');
    });
    
    // Hide glossary
    $('.btn-close-glossary').click(function() {
        $('.app').removeClass('hidden');
        $('.glossary').addClass('hidden');
    });
    
    // Settings buttons
    $('.setting-show-mode').click(function() {
        if(show_mode) {
            show_mode = false;
            $('.setting-show-mode').addClass('glyphicon-inactive');
        } else {
            show_mode = true; 
            $('.setting-show-mode').removeClass('glyphicon-inactive');
        }
    });
    
    $('.setting-choose-mode').click(function() {
        if(choose_mode) {
            choose_mode = false;
            $('.setting-choose-mode').addClass('glyphicon-inactive');
        } else {
            choose_mode = true; 
            $('.setting-choose-mode').removeClass('glyphicon-inactive');
        }
    });
    
    $('.setting-fill-mode').click(function() {
        if(fill_mode) {
            fill_mode = false;
            $('.setting-fill-mode').addClass('glyphicon-inactive');
        } else {
            fill_mode = true; 
            $('.setting-fill-mode').removeClass('glyphicon-inactive');
        }
    });

    $('.setting-reverse-mode').click(function() {
        if(reverse_mode) {
            reverse_mode = false;
            $('.setting-reverse-mode').addClass('glyphicon-inactive');
        } else {
            reverse_mode = true; 
            $('.setting-reverse-mode').removeClass('glyphicon-inactive');
        }
    });
    
    $('.setting-base-set').click(function() {
        if(include_base_set) {
            include_base_set = false;
            $('.setting-base-set').addClass('glyphicon-inactive');
        } else {
            include_base_set = true; 
            $('.setting-base-set').removeClass('glyphicon-inactive');
        }
    });
    
    $('.setting-diacritics').click(function() {
        if(include_diacritics) {
            include_diacritics = false;
            $('.setting-diacritics').addClass('glyphicon-inactive');
        } else {
            include_diacritics = true; 
            $('.setting-diacritics').removeClass('glyphicon-inactive');
        }
    });
    
    $('.setting-digraphs').click(function() {
        if(include_digraphs) {
            include_digraphs = false;
            $('.setting-digraphs').addClass('glyphicon-inactive');
        } else {
            include_digraphs = true; 
            $('.setting-digraphs').removeClass('glyphicon-inactive');
        }
    });
    
    $('.setting-digraph-diacritics').click(function() {
        if(include_diacritic_digraphs) {
            include_diacritic_digraphs = false;
            $('.setting-digraph-diacritics').addClass('glyphicon-inactive');
        } else {
            include_diacritic_digraphs = true; 
            $('.setting-digraph-diacritics').removeClass('glyphicon-inactive');
        }
    });
    
    $('.setting-katakana').click(function() {
        if(syllabary == "hiragana") {
            syllabary = "katakana";
            $('.setting-hiragana').addClass('glyphicon-inactive');
            $('.setting-katakana').removeClass('glyphicon-inactive');
            $('.header').html('Katakana Flashcards');
        }
    });
    
    $('.setting-hiragana').click(function() {
        if(syllabary == "katakana") {
            syllabary = "hiragana";
            $('.setting-katakana').addClass('glyphicon-inactive');
            $('.setting-hiragana').removeClass('glyphicon-inactive');
            $('.header').html('Hiragana Flashcards');
        }
    });
    /* Init app */

    current_set = hiragana;
    
    getNewKana();
    switchChoose();
    $('.app').removeClass('hidden');
    console.log("Hello! I love feedback. If you have any comments or suggestions (or if you find any bugs), please let me know.");
    console.log("ian" + "@" + "kana.ninja");
    
})(jQuery);