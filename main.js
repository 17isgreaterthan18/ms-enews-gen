/*

Created by Wyatt Robinson of the class of 2024
   2022 & 2023 & 2024

*/

const DEFAULT_BG_COLOR = '#0506b0';
const DEFAULT_COLOR = 'white';
const DEFAULT_BORDER_COLOR = 'black';
const DEFAULT_STYLE = 'border-collapse: collapse; border-radius: 20px; border-width: 1px; border-style: solid; width: 50%; padding: 10px; text-align: center;';

function gen() {
    const INPT_announcements = document.getElementById('annc').value;
    const INPT_cycle_day = document.getElementById('cd').value;
    const INPT_toggle_fun_fact = document.getElementById('ff').checked;
    const INPT_toggle_word_wednesday = document.getElementById('ww').checked;
    const INPT_toggle_word_wednesday_strike_out = document.getElementById('ww-strike-out').checked;
    const INPT_toggle_custom_colors = document.getElementById('cc').checked;
    const INPT_toggle_custom_style = document.getElementById('cs').checked;
    const INPT_toggle_custom_span_style = document.getElementById('ss').checked;
    const INPT_toggle_step_gradient = document.getElementById('sg').checked;
    const INPT_toggle_sg_by_cell = document.getElementById('toggle-by-cell').checked;
    const INPT_fun_fact = document.getElementById('ff-f').value;
    const INPT_word = document.getElementById('ww-word').value;
    const INPT_definition = document.getElementById('ww-def').value;
    const INPT_custom_style = document.getElementById('custom-style').value;
    const INPT_span_style = document.getElementById('span-style').value;
    const INPT_custom_color_font = document.getElementById('cc-font-color').value;
    const INPT_custom_color_bg = document.getElementById('cc-bg-color').value;
    const INPT_custom_color_border = document.getElementById('cc-border-color').value;
    const INPT_step_gradient_colors = document.getElementById('step-gradient').value.split('|');
    const INPT_left_footer = document.getElementById('left-footer-input').value;
    const INPT_right_footer = document.getElementById('right-footer-input').value;

    // table opening tag
    let o = '<table style=\"background-color: transparent;\">';

    let font_color = DEFAULT_COLOR;
    let bg_colors = [DEFAULT_BG_COLOR];
    let border_color = DEFAULT_BORDER_COLOR;
    let cell_style = INPT_toggle_custom_style ? INPT_custom_style : DEFAULT_STYLE;

    if (INPT_toggle_custom_colors) { // use custom colors
        font_color = INPT_custom_color_font;
        bg_colors = [INPT_custom_color_bg];
        border_color = INPT_custom_color_border;
    }

    if (INPT_toggle_step_gradient) { // use step gradient for background colors
        bg_colors = INPT_step_gradient_colors;
    }

    // fetch date & format it
    const wdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const d = new Date();
    const date = `${wdays[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

    let annc = INPT_announcements;

    if (INPT_toggle_fun_fact) { // add fun fact, if selected
        let ff = `<span style=\"font-size: 23;\"><b>Fun Fact</b>:</span><br>${INPT_fun_fact}|`;
        annc = ff + annc; // append to front of input array
    }
    if (INPT_toggle_word_wednesday) { // add Word Wednesday, if selected
        let ww = `Today's ${INPT_toggle_word_wednesday_strike_out ? `<span style="text-decoration: line-through;">Wednesday</span> ${wdays[d.getDay()]}` : 'Wednesday'} Word:<br><span style=\"font-size: 25px\">${INPT_word}</span><br>${INPT_definition}|`;
        annc = ww + annc; // append to front of input array
    }

    // get announcements input
    annc = annc.replaceAll('[', '<b>').replaceAll(']', '</b>'); // easy bolding with [ & ]
    annc = annc.replaceAll('\`', '<br>'); // easy line-break with `
    if (INPT_toggle_custom_span_style) { // custom span style
        annc = annc
            .replaceAll('{', `<span style=\"${INPT_span_style}\">`)
            .replaceAll('}', '</span>');
    }

    const divisor = INPT_toggle_sg_by_cell ? 1 : 2;
    annc = annc.split('|').map(function(element, index) {
        let cell = {
            content: element,
            style: cell_style,
            color: font_color,
            border: border_color,
            assemble: function(cs) {
                return cs ? `<td style="${this.style}">${this.content}</td>` : `<td style="${this.style} color: ${this.color}; border-color: ${this.border}; background-color: ${this.background};">${this.content}</td>`;
            }
        };
        cell.background = bg_colors[Math.floor(index / divisor) % bg_colors.length];
        return cell;
    });
    
    // create header
    let header_left;
    // create left header cell. determine whether image or text is desired
    if (document.getElementById('ti').checked) {
        header_left = '<td style=\"text-align: center;\"><span style=\"font-family: Arial; text-align: center; font-size: 20;\">BHS Morning Show eNews<br></span></td>';   
    } else {
        header_left = '<td style=\"text-align: center;\">{logo here}</td>';   
    }
    // create right header
    let header_right = `<td style=\"text-align: center;\">${date}${INPT_cycle_day ? `<br>Cycle Day ${INPT_cycle_day}</td>` : ''}`;
    let header = `<tr>${header_left}${header_right}</tr>`; // combine into the header row
    
    o += header; // add header row to output

    if (annc.length > 1) {
        annc.forEach(function(element, index){
            if ((index + 1) % 2 == 0 || index == annc.length - 1) {
                o += element.assemble(INPT_toggle_custom_style) + '</tr>';  
            } else if ((index + 1) % 2 == 1) {
                o += '<tr>' + element.assemble(INPT_toggle_custom_style);
            } else {
                o += element.assemble(INPT_toggle_custom_style);
            }
        });
    } else {
        o += '<tr>' + annc[0].assemble(INPT_toggle_custom_colors) + '</tr>';    
    }

    o += '</table>'; // close table
    
    // footer
    footer = `<span style=\"float: left; font-size: 15; background-color: transparent;\">${INPT_left_footer}</span><span style=\"float: right; font-size: 15; background-color: transparent;\">${INPT_right_footer}</span>`;
    o += footer;
    
    // display / export
    document.getElementById('output').value = o; // display output
    document.getElementById('preview').innerHTML = o; // display preview
};

function SubToggle() {
    let wwinpt = document.getElementById('ww-inpt');
    let ffinpt = document.getElementById('ff-inpt');
    let ccinpt = document.getElementById('cc-inpt');
    let csinpt = document.getElementById('cs-inpt');
    let ssinpt = document.getElementById('ss-inpt');
    let sginpt = document.getElementById('sg-inpt');

    if (document.getElementById('ww').checked) {
        wwinpt.style.display = 'block';
    } else {
        wwinpt.style.display = 'none';
    };
    if (document.getElementById('ff').checked) {
        ffinpt.style.display = 'block';
    } else {
        ffinpt.style.display = 'none';
    };
    if (document.getElementById('cc').checked) {
        ccinpt.style.display = 'block';
    } else {
        ccinpt.style.display = 'none';
    }
    if (document.getElementById('cs').checked) {
        csinpt.style.display = 'block';
    } else {
        csinpt.style.display = 'none';
    }
    if (document.getElementById('ss').checked) {
        ssinpt.style.display = 'block';
    } else {
        ssinpt.style.display = 'none';
    }
    if (document.getElementById('sg').checked) {
        sginpt.style.display = 'block';
    } else {
        sginpt.style.display = 'none';
    }
}

function init() {
    var toggler = document.getElementsByClassName('caret');
    var i;

    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener('click', function() {
        this.parentElement.querySelector('.nested').classList.toggle('active');
        this.classList.toggle('caret-down');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key == 'Enter') {
            gen();
        }
    });
}
